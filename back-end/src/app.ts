/**
 * Required External Modules
 */
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import { errorHandler } from "./middlewares/error";
// routes
import feedRoutes from "./routes/feed.route";
// database
import database from "./database/connection";

const app = express();

/**
 *  App Configuration
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUTS");
  res.setHeader("Access-Control-Allow-headers", "Content-Type, Authorization");
  next();
});

/**
 * Routes
 */
app.use("/feed", feedRoutes);

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
