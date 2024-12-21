import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandlerMiddleware";
import prisma from "../config/prismaClient";
import { hashPassword, comparePassword } from "../utils/passwordUtils";

export const getProfile = asyncHandler(async (req: Request | any, res: Response | any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

export const updateProfile = asyncHandler(async (req: Request | any, res: Response) => {
  const { name, email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (password) {
    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }
  }

  const newName = name || user.name;
  const newEmail = email || user.email;
  const newPassword = password ? await hashPassword(password) : user.password;

  try {
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name: newName, email: newEmail, password: newPassword },
    });

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});

// admin controllers
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true } });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const newName = name || existingUser.name;
  const newEmail = email || existingUser.email;
  const newRole = role || existingUser.role;

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: newName,
      email: newEmail,
      role: newRole,
    },
  });

  res.status(200).json({
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingUser = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true } });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const deleteduser = await prisma.user.delete({ where: { id } });

  console.log("deleted user", deleteduser);

  res.status(200).json({ message: "User deleted successfully" });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
  res.status(200).json({ users });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true } });

  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ user });
});
