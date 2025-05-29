import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/user";
import { checkDatabaseForRacfid, generateRacfid } from "../utils/user";

// "/api/user/register"
export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const allUsers = await User.find({});
    let arrayLength = allUsers.length;
    const existingUser = allUsers.find((user) => user.email === req.body.email);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User(req.body);
    user.racfid = generateRacfid(arrayLength);

    while (await checkDatabaseForRacfid(User, user.racfid)) {
      arrayLength += 1;
      user.racfid = generateRacfid(arrayLength);
    }

    user.createdAt = new Date();
    user.lastUpdated = new Date();
    await user.save();

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_ACCESS_TOKEN_KEY as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_REFRESH_TOKEN_KEY as string,
      { expiresIn: "1d" }
    );

    return res
      .status(201)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      })
      .json({ accessToken, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// "/api/user/users"
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// "/api/user/profile"
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, name, password } = req.body;
    user.email = email;
    user.name = name;
    user.password = password;
    user.lastUpdated = new Date();
    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
