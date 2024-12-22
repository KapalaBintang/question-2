import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandlerMiddleware";
import prisma from "../config/prismaClient";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

// Add product to cart
export const addToCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  // Find or create cart for the user
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Check if the product already exists in the cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.userId, productId },
  });

  if (existingCartItem) {
    // Update the quantity of the existing cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });

    res.status(200).json(updatedCartItem);
  } else {
    // Add new item to cart
    const cartItem = await prisma.cartItem.create({
      data: { cartId: cart.userId, productId, quantity },
    });

    res.status(201).json(cartItem);
  }
});

// Get all items in the cart
export const getCartItems = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          product: true, // Include product details
        },
      },
    },
  });

  if (!cart) {
    res.status(404).json({ message: "Cart is empty" });
    return;
  }

  res.status(200).json(cart.cartItems);
});

// Update quantity of a product in the cart
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400).json({ message: "Quantity must be at least 1" });
    return;
  }

  const cartItem = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });

  res.status(200).json(cartItem);
});

// Delete a product from the cart
export const deleteCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.cartItem.delete({ where: { id } });
  res.status(204).send();
});

// Clear the cart
export const clearCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  await prisma.cartItem.deleteMany({ where: { cartId: userId } });
  res.status(204).send({ message: "Cart cleared successfully" });
});
