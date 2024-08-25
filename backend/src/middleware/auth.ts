import { check } from "express-validator";

export const validateRegistration = [
  check("racfid", "Employee ID begins with J and contains 6 numbers").matches(
    /J\d{6}/
  ),
  check(
    "password",
    "Passwords must meet strong password criteria"
  ).isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  check("email", "Email is required").notEmpty().isEmail(),
  check("name", "Name is required").notEmpty().isString(),
];

export const validateSignIn = [
  check("racfid", "Employee ID begins with J and contains 6 numbers").matches(
    /J\d{6}/
  ),
  check(
    "password",
    "Passwords must meet strong password criteria"
  ).isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
];
