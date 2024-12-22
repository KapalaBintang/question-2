import express from "express";
import { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById } from "../controllers/productController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, authorizeRoles(["ADMIN", "SELLER"]), createProduct);
router.get("/", authenticate, getAllProducts);
router.put("/:id", authenticate, authorizeRoles(["ADMIN", "SELLER"]), updateProduct);
router.delete("/:id", authenticate, authorizeRoles(["ADMIN", "SELLER"]), deleteProduct);
router.get("/:id", getProductById);

export default router;
