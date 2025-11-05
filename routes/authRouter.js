import { Router } from "express";
import controllers from "../controllers/authControllers.js";
import upload from "../middlewares/upload.js";
import validateBody from "../helpers/validateBody.js";
import registerUser from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  validateBody(registerUser),
  controllers.registerUser
);

export default authRouter;
