import { Router } from "express";
import {
  createArticle,
  getAllArticles,
  getOneArticle,
} from "../controllers/articlesControllers.js";
import { createArticleSchema } from "../schemas/articleSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";

const articlesRouter = Router();

// articlesRouter.use("/", async (req, res) => {
//   res.send("Articles router is working");
// });
articlesRouter.use(authenticate);

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:id", getOneArticle);

articlesRouter.post(
  "/",
  isEmptyBody,
  validateBody(createArticleSchema),
  createArticle
);

export default articlesRouter;
