import { check } from "express-validator";

export const validateIssueCreation = [
  check("issueCode", 'Written in format "JI-XXXXXX" with 6 numbers').matches(
    /JI-\d{6}/
  ),
  check("issueCategory", "Category is required ").notEmpty().isString(),
  check("name", "Issue Name is required").notEmpty().isString(),
  check("description", "Issue Description is required").notEmpty().isString(),
  check("storyPoints", "Story point data type should be a number").isNumeric(),
  check("columnId", "Column ID/issue status required").notEmpty().isString(),
];
