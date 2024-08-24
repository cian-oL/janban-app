import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { validationResult } from "express-validator";

export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const { racfid } = req.body;

    const existingUser = await User.findOne({ racfid });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = new User(req.body);
    await newUser.save();

    const accessToken = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_ACCESS_TOKEN_KEY as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_REFRESH_TOKEN_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    return res.status(201).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUser = async (req: Request, res: Response) => {};

export const updateUser = async (req: Request, res: Response) => {};
