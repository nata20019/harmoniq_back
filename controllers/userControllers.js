import path from "path";
import fs from "fs/promises";
import { Jimp } from "jimp";
import HttpError from "../helpers/HttpError.js";
import { AVATARS_PATH } from "../constants/index.js";
import { User } from "../models/user.js";

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(HttpError(400, "File is required for avatar update"));
  }

  const { _id } = req.user;
  console.log("req.file:", req.file);
  const { path: oldPath, originalname } = req.file;
  const filename = req.file.filename || originalname;
  const newPath = path.join(AVATARS_PATH, filename);

  try {
    const image = await Jimp.read(oldPath);
    console.log("image", image);
    image.resize({ w: 250, h: 250 });
    await image.write(newPath);
    await fs.unlink(oldPath);
    // await fs.rename(oldPath, newPath);

    // Замість цього:
    // const avatarURL = path.join("avatars", filename);

    const avatarURL = `avatars/${filename}`;

    const newUser = await User.findByIdAndUpdate(
      _id,
      { avatarURL },
      { new: true },
    );
    if (!newUser) {
      throw HttpError(404, "User not found");
    }

    res.json({
      avatarURL: newUser.avatarURL,
    });
  } catch (error) {
    await fs.unlink(oldPath).catch((err) => console.log(err));
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    // Шукаємо всіх користувачів, але вибираємо ТІЛЬКИ ім'я, аватар та id
    const users = await User.find({}, "name avatarURL _id");

    res.json(users);
  } catch (error) {
    next(error);
  }
};
