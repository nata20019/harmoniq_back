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

const articlesRouter = Router();

// articlesRouter.use("/", async (req, res) => {
//   res.send("Articles router is working");
// });
articlesRouter.use(authenticate);

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:id", isValidId, getOneArticle);

articlesRouter.post(
  "/",
  (req, res, next) => {
    console.log("Middlewares started. Body:", req.body);
    next();
  },
  isEmptyBody,
  validateBody(createArticleSchema),
  createArticle
);

articlesRouter.delete("/:id", isValidId, deleteArticle);

articlesRouter.put(
  "/:id",
  isValidId,
  validateBody(updateArticleSchema),
  updateArticle
);

export default articlesRouter;
