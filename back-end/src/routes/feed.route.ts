import express from "express";
import * as feedController from "../controllers/feed.controller";
import * as validators from "../middlewares/validators";
import { errorValidator } from "../middlewares/error";

const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post(
  "/posts",
  validators.createPost,
  errorValidator,
  feedController.createPost
);

router.get("/posts/:postId", feedController.getPost);

router.put(
  "/posts/:postId",
  validators.createPost,
  errorValidator,
  feedController.updatePost
);

router.delete("/posts/:postId", feedController.deletePost);

export default router;
