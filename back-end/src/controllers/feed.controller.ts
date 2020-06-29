import { Request, Response, NextFunction } from "express";
// Model
import { Post } from "../models/post.model";
import HttpException from "../common/http-exception";

export const getPosts = (req: Request, res: Response, next: NextFunction) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => {
      if (!(err.statusCode === 500)) {
        err.statusCode === 500;
      }
      next(err);
    });
};

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  if (!req.file) {
    const error = new Error("No image provided.") as HttpException;
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;

  const post = new Post({
    title,
    content,
    creator: { name: "Kelvin " },
    imageUrl,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({ post: result });
    })
    .catch((err) => {
      console.log(err);
      if (!(err.statusCode === 500)) {
        err.statusCode === 500;
      }
      next(err);
    });
};

export const getPost = (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find a post") as HttpException;
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ post });
    })
    .catch((err) => {
      if (!(err.statusCode === 500)) {
        err.statusCode === 500;
      }
      next(err);
    });
};
