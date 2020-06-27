import express from "express";
import * as feedController from "../controllers/feed.controller";
import * as validators from "../middlewares/validators";

const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post("/posts", validators.createPost, feedController.createPost);

export default router;
