import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";

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
    .catch((err) => {
      if (!(err.statusCode === 500)) {
        err.statusCode === 500;
      }
      next(err);
    });
};
