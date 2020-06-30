import { body } from "express-validator";
import { User } from "../models/user.model";

export const createPost = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

export const signUp = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid e-mail.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-mail address already exists!");
        }
      });
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().notEmpty(),
];

export const login = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid e-mail.")
    .normalizeEmail(),
  body("password").trim().notEmpty(),
];

export const status = [body("status").trim().not().isEmpty()];
