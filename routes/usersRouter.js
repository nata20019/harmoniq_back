import { Router } from "express";
import { updateUserAvatar } from "../controllers/userControllers.js";
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";

const usersRouter = Router();

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateUserAvatar
);

export default usersRouter;
