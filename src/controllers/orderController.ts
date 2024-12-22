import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandlerMiddleware";
import prisma from "../config/prismaClient";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

// Checkout
export const checkout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { address, paymentMethod } = req.body;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: { include: { product: true } },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    res.status(400).json({ message: "Cart is empty" });
    return;
  }

  // Calculate total price
  const totalPrice = cart.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      shipping: { create: { address } },
      sellerId: cart.cartItems[0].product.userId,
      payment: { create: { method: paymentMethod } },
    },
  });

  // Clear the cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.userId } });

  res.status(201).json(order);
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
