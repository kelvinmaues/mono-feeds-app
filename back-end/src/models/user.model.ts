/**
 * Required External Modules
 */
import mongoose from "mongoose";
import { TUser } from "../types/user.type";

const Schema = mongoose.Schema;

/**
 * Data Model Interfaces
 */
export type UserDocument = mongoose.Document & TUser;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

export const User = mongoose.model<UserDocument>("User", userSchema);
