import express from "express";
import {
  getUser,
  registerUser,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.get("/", getUser);
router.put("/", updateUser);

export default router;
