import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/user";
import { validationResult } from "express-validator";

export const signInUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const { racfid, password } = req.body;

    const user = await User.findOne({ racfid });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (!passwordIsMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
      .status(200)
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

export const signOutUser = (req: Request, res: Response) => {
  res.clearCookie("refresh_token");
  return res.sendStatus(204);
};

export const generateAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken: string = req.cookies["refresh_token"];

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_KEY as string,
      async (err, decodedToken) => {
        if (err && err.message === "jwt expired") {
          res.clearCookie("refresh_token");
          return res.status(403).json({ message: "Token expired" });
        }

        if (err) {
          res.clearCookie("refresh_token");
          return res.status(401).json({ message: "Invalid token" });
        }

        const userId = (decodedToken as JwtPayload).userId.toString();
        const user = await User.findById(userId);

        if (!user) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
          {
            userId: user._id,
          },
          process.env.JWT_ACCESS_TOKEN_KEY as string,
          { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
          {
            userId: user._id,
          },
          process.env.JWT_REFRESH_TOKEN_KEY as string,
          { expiresIn: "1d" }
        );

        return res
          .status(200)
          .cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
          })
          .json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
