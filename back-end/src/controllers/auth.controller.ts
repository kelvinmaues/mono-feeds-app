import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const signUp = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

};
