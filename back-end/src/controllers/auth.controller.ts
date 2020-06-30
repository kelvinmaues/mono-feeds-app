import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserDocument } from "../models/user.model";
import catchError from "../common/catch-error";
import HttpException from "../common/http-exception";

export const signup = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        email,
        password: hashedPass,
        name,
      });
      return user.save();
    })
    .then(() => {
      res.status(201).json({ success: true });
    })
    .catch((err) => catchError(err, next));
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let loadedUser: UserDocument;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new HttpException(401, "The user was not found");
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isMatch) => {
      if (!isMatch) {
        const error = new HttpException(401, "Invalid password!");
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "Th3d@rks1d3",
        {
          expiresIn: "1h",
        }
      );
      res
        .status(200)
        .json({ token, userId: loadedUser._id.toString(), user: loadedUser });
    })
    .catch((err) => catchError(err, next));
};

export const getUserStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        throw new HttpException(404, "User not found.");
      }
      res.status(200).json({ status: user.status });
    })
    .catch((err) => catchError(err, next));
};

export const updateUserStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        throw new HttpException(404, "User not found.");
      }
      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "User updated." });
    })
    .catch((err) => catchError(err, next));
};
