import HttpError from "../helpers/HttpError.js";
import { Article } from "../models/article.js";
import path from "path";
import fs from "fs/promises";

export const getAllArticles = async (req, res, next) => {
  try {
    // 1. Перевіряємо, чи є користувач (захист від крашу)
    const owner = req.user ? req.user._id : null;

    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    // const filter = favorite ? { owner, favorite: favorite } : { owner };
    // 2. Логіка фільтрації:
    // Якщо ми на головній (Popular Articles), нам НЕ треба фільтрувати за owner.
    // Якщо ти хочеш показувати ВСІ статті всім, просто прибери owner з фільтра.
    const filter = {};
    const articles = await Article.find(filter, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "name avatarURL email");
    res.json({ status: 200, data: { articles } });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

export const getOneArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Це id статті:", id);
    // const { _id: owner } = req.user;
    // const article = await Article.findOne({ _id: id, owner });

    // Шукаємо просто за ID, не прив'язуючись до owner,
    // щоб будь-хто міг прочитати статтю
    const article = await Article.findById(id).populate(
      "owner",
      "name avatarURL email",
    );
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

const articlesDir = path.resolve("public", "articles");

export const createArticle = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    let imagePath = "";

    if (req.file) {
      const { path: tempUpload, originalname } = req.file;
      const filename = `${owner}_${Date.now()}_${originalname}`;
      const resultUpload = path.join(articlesDir, filename);

      // Переміщуємо з temp у public/articles
      await fs.rename(tempUpload, resultUpload);

      // Шлях, який ми запишемо в БД (щоб фронтенд міг його відкрити)
      imagePath = path.join("articles", filename).replace(/\\/g, "/");
    }

    const newArticle = await Article.create({
      ...req.body, // Тут title, description, category
      image: imagePath,
      owner,
    });

    res.status(201).json({ status: 201, data: { newArticle } });
  } catch (error) {
    // Якщо сталася помилка, видаляємо файл із temp, щоб не засмічувати сервер
    if (req.file) await fs.unlink(req.file.path);
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const updateData = { ...req.body };
    // Якщо завантажено новий файл, міняємо шлях до зображення
    if (req.file) {
      const { path: tempUpload, originalname } = req.file;
      const filename = `${owner}_${Date.now()}_${originalname}`;
      const resultUpload = path.join(articlesDir, filename);
      await fs.rename(tempUpload, resultUpload);
      updateData.image = path.join("articles", filename).replace(/\\/g, "/");
    }
    const updatedArticle = await Article.findOneAndUpdate(
      { _id: id, owner },
      updateData,
      { new: true },
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
      },
    ).populate("owner", "name avatarURL email");
    if (!updatedArticle) {
      next(HttpError(404, "Article not found"));
    }
    res.json({ status: 200, data: { updatedArticle } });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};
