import HttpError from "../helpers/HttpError.js";
import { Article } from "../models/article.js";

export const getAllArticles = async (req, res, next) => {
  try {
    console.log("Це req.user:", req.user);
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    const filter = favorite ? { owner, favorite: favorite } : { owner };
    const articles = await Article.find(filter, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "email");
    res.json({ status: 200, data: { articles } });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

export const getOneArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const article = await Article.findOne({ _id: id, owner });
    if (!article) {
      next(HttpError(404, `Article with id = ${id} not found`));
    }
    res.json({ status: 200, data: { article } });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const deletedArticle = await Article.findOneAndDelete({ _id: id, owner });
    if (!deletedArticle) {
      next(HttpError(404, "Article not found"));
    }
    res.json({
      status: 200,
      message: "Article deleted",
      data: { deletedArticle },
    });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const newArticle = await Article.create({ ...req.body, owner });
    res.json({ status: 201, data: { newArticle } });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const updatedArticle = await Article.findOneAndUpdate(
      { _id: id, owner },
      req.body
    );
    if (!updatedArticle) {
      next(HttpError(404, "Article not found"));
    }
    res.json({ status: 200, data: { updatedArticle } });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

export const updateStatusArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { favorite: req.body.favorite },
      {
        new: true,
      }
    );
    if (!updatedArticle) {
      next(HttpError(404, "Article not found"));
    }
    res.json({ status: 200, data: { updatedArticle } });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};
