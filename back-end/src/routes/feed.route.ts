import express from "express";
import * as feedController from "../controllers/feed.controller";
import * as validators from "../middlewares/validators";
import { errorValidator } from "../middlewares/error";
import isAuth from "../middlewares/is-auth";

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);

// itemsRouter.use(checkJwt);

router.post(
  "/posts",
  isAuth,
  validators.createPost,
  errorValidator,
  feedController.createPost
);

router.get("/posts/:postId", feedController.getPost);

router.put(
  "/posts/:postId",
  isAuth,
  validators.createPost,
  errorValidator,
  feedController.updatePost
);

router.delete("/posts/:postId", isAuth, feedController.deletePost);

export default router;
