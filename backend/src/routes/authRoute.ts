import express from "express";
import { signInUser } from "../controllers/authController";
import { validateSignIn } from "../middleware/auth";

const router = express.Router();

// "/api/auth"
router.post("/sign-in", validateSignIn, signInUser);

export default router;
