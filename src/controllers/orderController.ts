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

// Update order status (Admin)
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  res.status(200).json(order);
});
