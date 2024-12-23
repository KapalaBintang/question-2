import express, { Request, Response } from "express";
import { addProductReview, getProductWithReviews } from "../controllers/reviewController";
import { authenticate } from "../middlewares/authMiddleware";

const route = express.Router();

route.post("/", authenticate, addProductReview);
route.get("/:id", getProductWithReviews);
