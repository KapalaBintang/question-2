import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";
import { getProfile, updateProfile, updateUser, deleteUser, getAllUsers, getUserById } from "../controllers/userController";

const router = express.Router();

router.route("/").get(authenticate, getProfile).put(authenticate, updateProfile);
router.get("/getAll", authenticate, authorizeRoles(["ADMIN"]), getAllUsers);
router
  .route("/:id")
  .put(authenticate, authorizeRoles(["ADMIN"]), updateUser)
  .delete(authenticate, authorizeRoles(["ADMIN"]), deleteUser)
  .get(authenticate, getUserById);

export default router;
