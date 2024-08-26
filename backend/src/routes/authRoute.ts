import express from "express";
import {
  generateAccessToken,
  signInUser,
  signOutUser,
} from "../controllers/authController";
import { verifyAccessToken, validateSignIn } from "../middleware/auth";

const router = express.Router();

// "/api/auth"
router.post("/sign-in", validateSignIn, signInUser);
router.post("/sign-out", verifyAccessToken, signOutUser);
router.get("/access-token", generateAccessToken);

export default router;
