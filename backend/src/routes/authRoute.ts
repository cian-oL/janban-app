import express from "express";
import { signInUser, signOutUser } from "../controllers/authController";
import { validateSignIn } from "../middleware/auth";

const router = express.Router();

// "/api/auth"
router.post("/sign-in", validateSignIn, signInUser);
router.post("/sign-out", validateSignIn, signOutUser);

export default router;
