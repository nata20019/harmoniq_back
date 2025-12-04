import { Router } from "express";
import authController from "../controllers/authControllers.js";
import upload from "../middlewares/upload.js";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  userSigninSchema,
  verifyEmailSchema,
} from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = Router();

authRouter.post(
  "/register",
  upload.single("avatarURL"),
  validateBody(registerSchema),
  authController.registerUser
);

authRouter.get("/verify/:verificationToken", authController.verifyEmail);
authRouter.post(
  "/verify",
  validateBody(verifyEmailSchema),
  authController.resendVerifyEmail
);
authRouter.post(
  "/signin",
  validateBody(userSigninSchema),
  authController.loginUser
);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;
