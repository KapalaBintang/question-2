import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

export const authenticate = (req: AuthenticatedRequest, res: Response | any, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const user = verifyAccessToken(token);
    console.log("ini user", user);
    req.user = user;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response | any, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
