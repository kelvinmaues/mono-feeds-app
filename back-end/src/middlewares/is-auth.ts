import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import HttpException from "../common/http-exception";
import { UserDocument } from "../models/user.model";
import { JWTPayload } from "../@types/jwt-payload.type";

export default (req: Request, res: Response, next: NextFunction) => {
  let token: string = req.get("Authorization") || "";
  token = token && token.split(" ")[1];
  let decodedToken;

  if (!token) {
    throw new HttpException(401, "not-authenticated");
  }

  try {
    decodedToken = <JWTPayload>jwt.verify(token, "Th3d@rks1d3");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    throw new HttpException(401, "unauthorized");
  }

  req.userId = decodedToken.userId;
  next();
};
