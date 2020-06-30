import express from "express";
// validators
import * as validator from "../middlewares/validators";
import { errorValidator } from "../middlewares/error";
import * as authController from "../controllers/auth.controller";
import isAuth from "../middlewares/is-auth";

const router = express.Router();

router.post("/signup", validator.signUp, errorValidator, authController.signup);

router.post("/login", validator.login, errorValidator, authController.login);

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  validator.status,
  authController.updateUserStatus
);

export default router;
