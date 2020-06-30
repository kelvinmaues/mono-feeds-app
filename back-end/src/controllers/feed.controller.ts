import { Request, Response, NextFunction } from "express";
// Model
import { Post, PostDocument } from "../models/post.model";
import { User, UserDocument } from "../models/user.model";
// common
import HttpException from "../common/http-exception";
import catchError from "../common/catch-error";
// utils
import clearImage from "../utils/clear-image";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentPage = Number(req.query.page) || 1;
  const perPage = 2;
  let totalItems: number;

  await Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({ posts, totalItems });
    })
    .catch((err) => catchError(err, next));
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
    creator: req.userId,
    imageUrl,
  });

  post
    .save()
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      if (!user) {
        throw new HttpException(401, "User not found!");
      }
      user.posts.push(post);
      return user.save();
    })
    .then(() => {
      res.status(201).json({ post });
    })
    .catch((err) => catchError(err, next));
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
    .catch((err) => catchError(err, next));
};

export const updatePost = (req: Request, res: Response, next: NextFunction) => {
  const {
    params: { postId },
    body: { title, content, image },
  } = req;
  let imageUrl = image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked") as HttpException;
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find a post") as HttpException;
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((postSaved) => {
      res.status(200).json({ post: postSaved });
    })
    .catch((err) => catchError(err, next));
};

export const deletePost = (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
      // Check logged in user
      if (!post) {
        const error = new Error("Could not find a post") as HttpException;
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      resp.status(200).json({ success: true });
    })
    .catch((err) => catchError(err, next));
};
