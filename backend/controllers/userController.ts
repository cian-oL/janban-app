import { Request, Response } from "express";

import User from "../models/user";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUser = async (req: Request, res: Response) => {};

export const updateUser = async (req: Request, res: Response) => {};
