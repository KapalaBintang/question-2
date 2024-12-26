import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandlerMiddleware";
import prisma from "../config/prismaClient";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

// Checkout
export const checkout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress) {
    return res.status(400).json({ message: "Shipping address is required" });
  }

  try {
    // Gunakan transaksi untuk memastikan konsistensi data
    const result = await prisma.$transaction(async (prisma) => {
      // Step 1: Ambil cart items berdasarkan userId
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
      });

      if (!cart || cart.cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Step 2: Hitung total harga dari cart items
      const totalPrice = cart.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      // Step 3: Buat order baru
      const order = await prisma.order.create({
        data: {
          userId,
          sellerId: cart.cartItems[0].product.userId,
          totalPrice,
          payment: {
            create: {
              method: paymentMethod,
              status: "SUCCESS",
            },
          },
          shipping: {
            create: {
              address: shippingAddress,
            },
          },
          status: "PENDING",
        },
      });

      // Step 4: Tambahkan items dari cart ke dalam order
      const orderItemsData = cart.cartItems.map((cartItem) => ({
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
      }));

      await prisma.orderItem.createMany({
        data: orderItemsData,
      });

      // Step 5: Kosongkan cart setelah order dibuat
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.userId },
      });

      // Step 6: Kurangkan stok
      await prisma.product.updateMany({
        where: { id: { in: cart.cartItems.map((item) => item.productId) } },
        data: { stock: { decrement: cart.cartItems.reduce((total, item) => total + item.quantity, 0) } },
      });

      return order;
    });

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// Track order
export const trackOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { payment: true, shipping: true },
  });

  res.status(200).json(orders);
});

// Get all orders with pagination
export const getAllOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const sellerId = req.user.id;
  const { page = 1, limit = 10 } = req.query; // Default pagination values
  const offset = (Number(page) - 1) * Number(limit);

  const orders = await prisma.order.findMany({
    where: { sellerId },
    skip: offset,
    take: Number(limit),
    include: {
      user: { select: { name: true, email: true } },
      shipping: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalOrders = await prisma.order.count();

  res.status(200).json({
    currentPage: Number(page),
    totalPages: Math.ceil(totalOrders / Number(limit)),
    totalOrders,
    orders,
  });
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const sellerId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["PENDING", "PROCESSING", "COMPLETED", "CANCELED"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: "Invalid status value" });
    return;
  }

  const updatedOrder = await prisma.order.update({
    where: { id, sellerId },
    data: { status },
  });

  res.status(200).json(updatedOrder);
});

// Get orders history
export const ordersHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const orders = await prisma.order.findMany({ where: { userId }, include: { payment: { select: { method: true, status: true, paidAt: true } }, shipping: { select: { address: true, deliveredAt: true, status: true, shippedAt: true } } } });
  res.status(200).json(orders);
});
