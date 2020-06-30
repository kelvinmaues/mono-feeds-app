/**
 * Required External Modules
 */
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
// internal imports
import { errorHandler } from "./middlewares/error";
import feedRoutes from "./routes/feed.route";
import authRoutes from "./routes/auth.route";
import database from "./database/connection";
import multerFileStorage from "./middlewares/multer-file-storage";

const app = express();

/**
 *  App Configuration
 */
app.use(cors());
app.use(bodyParser.json());
app.use(multerFileStorage);
app.use("/images", express.static(path.join(__dirname, "images")));

/**
 * Routes
 */
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

/**
 * Error Handler
 */
app.use(errorHandler);

/**
 * Database Connection
 */
database
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log("Database error =>", err));
