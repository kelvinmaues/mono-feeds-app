import { Request, Response, NextFunction } from "express";
// Model
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
// common
import HttpException from "../common/http-exception";
import catchError from "../common/catch-error";
// utils
import clearImage from "../utils/clear-image";
// connections
import io from "../socket";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentPage = Number(req.query.page) || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({ posts, totalItems });
  } catch (err) {
    catchError(err, next);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  try {
    await post.save();
    const user = await User.findById(req.userId);
    if (!user) {
      throw new HttpException(401, "User not found!");
    }
    user.posts.push(post);
    await user.save();
    io.getIO().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });
    res.status(201).json({ post });
  } catch (err) {
    catchError(err, next);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find a post") as HttpException;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ post });
  } catch (err) {
    catchError(err, next);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { postId },
    body: { title, content, image },
  } = req;
  let imageUrl = image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    throw new HttpException(422, "No file picked");
  }

  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      throw new HttpException(404, "Could not find a post");
    }
    if (post.creator._id.toString() !== req.userId) {
      throw new HttpException(403, "Not authorized");
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const postSaved = await post.save();
    io.getIO().emit("posts", { action: "update", post: postSaved });
    res.status(200).json({ post: postSaved });
  } catch (err) {
    catchError(err, next);
  }
};

export const deletePost = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new HttpException(404, "Could not find a post");
    }
    if (post.creator.toString() !== req.userId) {
      throw new HttpException(403, "Not authorized");
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    if (!user) {
      throw new HttpException(401, "User not found!");
    }
    user.posts.pull(postId);
    await user.save();
    resp.status(200).json({ success: true });
  } catch (err) {
    catchError(err, next);
  }
};
