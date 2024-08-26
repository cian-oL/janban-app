import express from "express";
import {
  getUser,
  registerUser,
  updateUser,
} from "../controllers/userController";
import { verifyAccessToken, validateRegistration } from "../middleware/auth";

const router = express.Router();

// "/api/user"
router.post("/register", validateRegistration, registerUser);
router.get("/profile", verifyAccessToken, getUser);
router.put("/profile", verifyAccessToken, updateUser);

export default router;
