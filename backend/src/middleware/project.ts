import { check } from "express-validator";

export const validateProjectCreation = [
  check("name", "Project Name is required").notEmpty().isString(),
  check("description", "Project Description is required").notEmpty().isString(),
];
