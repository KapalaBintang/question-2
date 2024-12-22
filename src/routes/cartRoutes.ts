import express from "express";
import { addToCart, getCartItems, updateCartItem, deleteCartItem, clearCart } from "../controllers/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, addToCart);
router.get("/", authenticate, getCartItems);
router.delete("/", authenticate, clearCart);
router.put("/:id", authenticate, updateCartItem);
router.delete("/:id", authenticate, deleteCartItem);

export default router;
