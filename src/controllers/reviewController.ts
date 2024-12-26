import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import asyncHandler from "../middlewares/asyncHandlerMiddleware";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

export const addProductReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const order = await prisma.order.findFirst({
    where: { userId: req.user.id, status: "COMPLETED", orderItem: { some: { productId } } },
  });

  if (!order) {
    return res.status(400).json({ message: "You have not bought this product" });
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      productId,
      userId: req.user.id,
    },
  });

  res.status(201).json(review);
});

export const updateProductReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const review = await prisma.review.update({
    where: { id },
    data: {
      rating,
      comment,
    },
  });

  res.status(200).json(review);
});

export const deleteProductReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const review = await prisma.review.delete({
    where: { id },
  });

  res.status(200).json(review);
});

export const getProductWithReviews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const averageRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length || 0;

    return res.status(200).json({ ...product, averageRating });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});
