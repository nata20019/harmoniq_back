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
  validateBody(registerSchema),
  authController.registerUser,
);

authRouter.get("/verify/:verificationToken", authController.verifyEmail);
authRouter.post(
  "/verify",
  validateBody(verifyEmailSchema),
  authController.resendVerifyEmail,
);
authRouter.post(
  "/login",
  validateBody(userSigninSchema),
  authController.loginUser,
);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.logout);
// Використовуємо PATCH для часткового оновлення
authRouter.patch("/update", authenticate, upload.single("avatar"), authController.updateUser);
export default authRouter;
