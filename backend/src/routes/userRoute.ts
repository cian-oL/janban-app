import express from "express";
import {
  getUser,
  registerUser,
  updateUser,
} from "../controllers/userController";
import { jwtCheck, validateRegistration } from "../middleware/auth";

const router = express.Router();

// "/api/user"
router.post("/register", validateRegistration, registerUser);
router.get("/profile", jwtCheck, getUser);
router.put("/profile", jwtCheck, updateUser);

export default router;
