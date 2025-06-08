import { check } from "express-validator";
import { issueCategoryEnum, issueColumnIdEnum } from "../models/issue";

export const validateIssueCreation = [
  check("issueCategory", "Category is required ")
    .notEmpty()
    .isString()
    .isIn(issueCategoryEnum),
  check("isBacklog", "Issue Backlog Status is required").exists().isBoolean(),
  check("name", "Issue Name is required").notEmpty().isString(),
  check("description", "Issue Description is required").notEmpty().isString(),
  check("storyPoints", "Story point data type should be a number").optional().isNumeric(),
  check("assignee", "Assignee data type should be a string").optional().isString(),
  check("columnId", "Issue Status (columnId) is required")
    .notEmpty()
    .isString()
    .isIn(issueColumnIdEnum),
];
