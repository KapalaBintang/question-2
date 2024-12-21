import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils";
import asyncHandler from "../middlewares/asyncHandlerMiddleware";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const findExistingUser = await prisma.user.findUnique({ where: { email } });

    if (findExistingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(user);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    const token = await prisma.token.create({
      data: { userId: user.id, token: refreshToken },
    });
    console.log(token);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none", secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ name: user.name, email: user.email, accessToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  console.log(refreshToken);

  try {
    const result = await prisma.token.deleteMany({ where: { token: refreshToken } });
    console.log(result);
    if (result.count === 0) {
      return res.status(404).json({ message: "Token not found" });
    }

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "none", secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error(error);
    const message = process.env.NODE_ENV === "production" ? "Error logging out" : error.message;
    res.status(500).json({ message });
  }
});
