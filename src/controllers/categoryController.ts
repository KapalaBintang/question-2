import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import asyncHandler from "../middlewares/asyncHandlerMiddleware";

// Create a new category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const category = await prisma.category.create({
      data: { name, description },
    });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
});

// Get all categories
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ include: { products: true } });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({ where: { id }, include: { products: true } });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
});
// Update a category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, description },
    });
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
});

// Delete a category
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
});
