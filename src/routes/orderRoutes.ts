import express from "express";
import { checkout, trackOrder, updateOrderStatus } from "../controllers/orderController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/checkout", authenticate, checkout);
router.get("/track", authenticate, trackOrder);
router.put("/:id/status", authenticate, authorizeRoles(["ADMIN"]), updateOrderStatus);

export default router;
