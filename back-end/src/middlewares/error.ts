import HttpException from "../common/http-exception";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const errorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 500;
  const message =
    error.message || "It's not you. It's us. We are having some problems.";
  const errors = error.errors;

  response.status(status).json(errors ? { errors } : { message });
};

export const errorValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed, entered data is incorrect."
    ) as HttpException;
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }
  return next();
};
