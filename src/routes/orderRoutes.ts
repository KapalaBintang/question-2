import express from "express";
import { checkout, trackOrder, updateOrderStatus, getAllOrders } from "../controllers/orderController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/checkout", authenticate, checkout);
router.get("/track", authenticate, trackOrder);
router.get("/", authenticate, authorizeRoles(["SELLER, ADMIN"]), getAllOrders);
router.put("/:id", authenticate, authorizeRoles(["SELLER"]), updateOrderStatus);

export default router;
