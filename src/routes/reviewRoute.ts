import express from "express";
import { addProductReview, getProductWithReviews, updateProductReview, deleteProductReview } from "../controllers/reviewController";
import { authenticate } from "../middlewares/authMiddleware";

const route = express.Router();

route.post("/", authenticate, addProductReview);
route.get("/:id", getProductWithReviews).put("/:id", authenticate, updateProductReview).delete("/:id", authenticate, deleteProductReview);

export default route;
