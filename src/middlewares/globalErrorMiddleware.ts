import { Request, Response, NextFunction } from "express";
const globalErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
};

export default globalErrorMiddleware;
