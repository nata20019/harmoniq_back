import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
} from "../controllers/articlesControllers.js";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../schemas/articleSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidId from "../middlewares/isValidId.js";
import upload from "../middlewares/upload.js";

const articlesRouter = Router();

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:id", isValidId, getOneArticle);

articlesRouter.delete("/:id", authenticate, isValidId, deleteArticle);

articlesRouter.put(
  "/:id",
  authenticate,
  isValidId,
  upload.single("image"),
  isEmptyBody,
  validateBody(updateArticleSchema),
  updateArticle,
);

articlesRouter.post(
  "/",
  authenticate,
  upload.single("image"), // Тепер поле 'image' у Postman працюватиме
  isEmptyBody,
  validateBody(createArticleSchema),
  createArticle,
);

export default articlesRouter;
