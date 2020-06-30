import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserDocument } from "../models/user.model";
import catchError from "../common/catch-error";
import HttpException from "../common/http-exception";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name } = req.body;

  try {
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPass,
      name,
    });
    await user.save();
    res.status(201).json({ success: true });
  } catch (err) {
    catchError(err, next);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpException(401, "The user was not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(401, "Invalid password!");
    }

    const token = await jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "Th3d@rks1d3",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, userId: user._id.toString(), user });
  } catch (err) {
    catchError(err, next);
  }
};

export const getUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new HttpException(404, "User not found.");
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    catchError(err, next);
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newStatus = req.body.status;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new HttpException(404, "User not found.");
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: "User updated." });
  } catch (err) {
    catchError(err, next);
  }
};
