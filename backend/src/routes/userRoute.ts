import express from "express";
import {
  getUser,
  registerUser,
  updateUser,
} from "../controllers/userController";
import { validateRegistration } from "../middleware/auth";

const router = express.Router();

// "/api/user"
router.post("/register", validateRegistration, registerUser);
router.get("/", getUser);
router.put("/", updateUser);

export default router;
