import express from "express";
import {
  createIssue,
  getAllIssues,
  getIssue,
  updateIssue,
  deleteIssue,
} from "../controllers/issueController";
import { verifyAccessToken } from "../middleware/auth";
import { validateIssueCreation } from "../middleware/issue";

const router = express.Router();

// "/api/issues"
router.post(
  "/create-issue",
  verifyAccessToken,
  validateIssueCreation,
  createIssue
);
router.get("/", verifyAccessToken, getAllIssues);
router.get("/:issueCode", verifyAccessToken, getIssue);
router.put("/:issueCode", verifyAccessToken, updateIssue);
router.delete("/:issueCode", verifyAccessToken, deleteIssue);

export default router;
