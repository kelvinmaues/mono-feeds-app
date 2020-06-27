import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
// routes
import feedRoutes from "./routes/feed.route";
// database
import database from "./database/connection";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUTS");
  res.setHeader("Access-Control-Allow-headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

database
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log("Database error =>", err));
