import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, accessTokenSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => jwt.verify(token, accessTokenSecret);
export const verifyRefreshToken = (token: string) => jwt.verify(token, refreshTokenSecret);
