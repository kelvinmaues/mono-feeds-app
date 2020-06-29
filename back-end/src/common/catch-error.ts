import HttpException from "./http-exception";
import { NextFunction } from "express";

export default (err: HttpException, next: NextFunction) => {
  if (!(err.statusCode === 500)) {
    err.statusCode === 500;
  }
  next(err);
}