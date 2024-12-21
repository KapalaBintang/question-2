import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";

export const authenticate = (req: Request | any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user; // Attach to request
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request | any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
