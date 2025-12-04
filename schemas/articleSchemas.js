import Joi from "joi";

export const createArticleSchema = Joi.object({
  name: Joi.string().min(3).max(48).required(),
  describe: Joi.string().min(100).max(4000).required(),
  data: Joi.date().required(),
  author: Joi.string().min(4).max(50).required(),
});

export const updateArticleSchema = Joi.object({
  name: Joi.string().min(3).max(48),
  describe: Joi.string().min(100).max(4000).required(),
  data: Joi.date(),
  author: Joi.string().min(4).max(50),
});
