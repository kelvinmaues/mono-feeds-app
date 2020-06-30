/**
 * Required External Modules
 */
import mongoose from "mongoose";
import { TPost } from "../@types/post.type";

/**
 * Data Model Interfaces
 */

export type PostDocument = mongoose.Document & TPost;

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<PostDocument>("Post", postSchema);
