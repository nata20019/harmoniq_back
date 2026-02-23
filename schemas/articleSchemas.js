import Joi from "joi";

export const createArticleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(50).max(4000).required(),
  data: Joi.date().optional(),
  // owner: Joi.string().min(3).max(50),
  category: Joi.string().min(4).max(50).optional(),
  favorite: Joi.boolean().optional(),
  image: Joi.string().optional(),
});

export const updateArticleSchema = Joi.object({
  title: Joi.string().min(3).max(48).optional(),
  description: Joi.string().min(100).max(4000).optional(),
  data: Joi.date().optional(),
  owner: Joi.string().min(4).max(50).optional(),
  image: Joi.string().optional(),
  category: Joi.string().min(4).max(50).optional(),
  favorite: Joi.boolean().optional(),
});
