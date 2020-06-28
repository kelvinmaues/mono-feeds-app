import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Post } from "../models/post.model";

export const getPosts = (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/stand.png",
        creator: {
          name: "Kelvin",
        },
        createdAt: new Date(),
      },
    ],
  });
};

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    creator: { name: "Kelvin " },
    imageUrl: "images/stand.png",
  });
  post
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Post created successfully", post: result });
    })
    .catch((err) => {
      if (!(err.statusCode === 500)) {
        err.statusCode === 500;
      }
      next(err);
    });
};
