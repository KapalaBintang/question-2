import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import asyncHandler from "../middlewares/asyncHandlerMiddleware";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

// Create a new product
export const createProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { name, description, price, condition, stock, categoryId } = req.body;

  if (!name || !description || !price || !condition || !categoryId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        condition,
        stock,
        categoryId,
        userId,
      },
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// Get all products
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  const findProduct = search
    ? {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      }
    : {};

  try {
    const products = await prisma.product.findMany({
      where: findProduct,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
    });
    res.status(200).json({ message: "Products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Get a single product
export const getProductById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const userId = req.user.id;

  try {
    const product = await prisma.product.findUnique({
      where: { id, userId },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// Update a product
export const updateProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, description, price, condition, stock, categoryId } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id, userId },
      data: { name, description, price, condition, stock, categoryId },
    });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Delete a product
export const deleteProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.product.delete({ where: { id, userId } });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});
