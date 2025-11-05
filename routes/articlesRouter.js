import { Router } from "express";
import { getAllArticles } from "../controllers/articlesControllers.js";

const articlesRouter = Router();

// articlesRouter.use("/", async (req, res) => {
//   res.send("Articles router is working");
// });

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:id", async (req, res) => {
  res.send(`Get article with id ${req.params.id}`);
});

export default articlesRouter;
