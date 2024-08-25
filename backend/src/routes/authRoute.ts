import express from "express";
import { signInUser, signOutUser } from "../controllers/authController";
import { jwtCheck, validateSignIn } from "../middleware/auth";

const router = express.Router();

// "/api/auth"
router.post("/sign-in", validateSignIn, signInUser);
router.post("/sign-out", jwtCheck, signOutUser);

export default router;
