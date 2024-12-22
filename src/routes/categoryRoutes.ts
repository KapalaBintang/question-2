import express from "express";
import { createCategory, getAllCategories, updateCategory, deleteCategory, getCategoryById } from "../controllers/categoryController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, authorizeRoles(["ADMIN"]), createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", authenticate, authorizeRoles(["ADMIN"]), updateCategory);
router.delete("/:id", authenticate, authorizeRoles(["ADMIN"]), deleteCategory);

export default router;
