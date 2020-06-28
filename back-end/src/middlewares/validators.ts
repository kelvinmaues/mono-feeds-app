import { body } from "express-validator";

export const createPost = [
  body("title").trim().isLength({ min: 7 }),
  body("content").trim().isLength({ min: 5 }),
];
