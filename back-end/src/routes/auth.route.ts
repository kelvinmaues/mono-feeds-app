import express from "express";
// validators
import * as validator from "../middlewares/validators";
import { errorValidator } from "../middlewares/error";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", validator.signUp, errorValidator, authController.signUp);

router.post("/login");

export default router;
