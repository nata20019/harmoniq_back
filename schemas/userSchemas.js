import Joi from "joi";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = Joi.object({
  username: Joi.string().min(2).max(32).required(),
  email: Joi.string().pattern(emailPattern).max(64).required(),
  password: Joi.string().min(8).max(64).required(),
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
}).messages({
  "any.required": "missing required field email",
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().required(),
});

export const updateUserAvatarSchema = Joi.object({
  avatar: Joi.any(),
});

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(64).required(),
  newPassword: Joi.string().min(8).max(64).required(),
});
export const userSchema = Joi.object({
  avatar: Joi.any(),
  username: Joi.string().min(2).max(32).required(),
  email: Joi.string().pattern(emailPattern).max(64).required(),
  password: Joi.string().min(8).max(64).required(),
  _id: Joi.string(),
});
