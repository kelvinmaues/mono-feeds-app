import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import catchError from "../common/catch-error";
import HttpException from "../common/http-exception";

export const signUp = (req: Request, res: Response, next: NextFunction) => {
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
  let loadedUser;

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
    })
    .catch((err) => catchError(err, next));
};
