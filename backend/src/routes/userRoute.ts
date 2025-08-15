import express from "express";
import {
  getAllUsers,
  getUser,
  registerUser,
  updateUser,
} from "../controllers/userController";
import { verifyAccessToken, validateRegistration } from "../middleware/auth";

const router = express.Router();

// "/api/user"
router.post("/register", validateRegistration, registerUser);
router.get("/users", verifyAccessToken, getAllUsers);
router.get("/profile", verifyAccessToken, getUser);
router.patch("/profile", verifyAccessToken, updateUser);

export default router;
