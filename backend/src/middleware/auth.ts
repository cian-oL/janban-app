import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

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

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = authorization.split(" ")[1];
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_KEY as string,
      (err, decodedToken) => {
        if (err && err.message === "jwt expired") {
          return res.status(403).json({ message: "Token expired" });
        }

        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }

        req.userId = (decodedToken as JwtPayload).userId.toString();

        next();
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
