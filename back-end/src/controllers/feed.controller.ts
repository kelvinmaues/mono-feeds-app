import { Request, Response, NextFunction } from "express";

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
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      id: new Date().toISOString(),
      title,
      content,
      creator: { name: "Kelvin" },
      createdAt: new Date(),
    },
  });
};
