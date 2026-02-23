import { Router } from "express";
import { updateUserAvatar, getUsers } from "../controllers/userControllers.js";
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../helpers/validateBody.js";
import { updateUserAvatarSchema } from "../schemas/userSchemas.js";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  validateBody(updateUserAvatarSchema),
  updateUserAvatar,
);

export default usersRouter;
