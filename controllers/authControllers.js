import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { AVATARS_PATH } from "../constants/index.js";
import sendEmail from "../helpers/sendEmail.js";
import "dotenv/config";

const { JWT_SECRET } = process.env;

const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: "Verify your email",
  html: `<a target="_blank" href="${process.env.SERVER_URL}/api/auth/verify/${verificationToken}">Click to verify your email</a>`,
});

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Це req.body:", req.body);

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    let avatarURL;
    if (!req.file) {
      avatarURL = gravatar.url(email, {
        s: "250", // розмір картинки
        r: "g", // рейтинг (пристойність)
        d: "identicon", // якщо граватара немає, генерує гарну геометрію
        protocol: "https", // ОБОВ'ЯЗКОВО для повноцінного посилання
      });
    } else {
      const { path: oldPath, originalname } = req.file;
      const newPath = path.join(AVATARS_PATH, originalname);
      await fs.rename(oldPath, newPath);
      avatarURL = path.join("avatars", originalname);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    const verifyEmail = createVerifyEmail(email, verificationToken);
    try {
      await sendEmail(verifyEmail);
    } catch (emailError) {
      console.warn(
        "User created, but verification email failed:",
        emailError.message,
      );
      // Тут можна вирішити: або видати помилку, або дозволити реєстрацію без листа
    }

    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path);
    }
    next(error);
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({ message: "Email verify success" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = createVerifyEmail(email, user.verificationToken);
  await sendEmail(verifyEmail);
  res.json({ message: "Verify email sent" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  console.log("Generated Token:", token);
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: { _id: user._id, email: user.email, username: user.username, avatarURL: user.avatarURL },
  });
};

const getCurrent = async (req, res) => {
  const { _id, email, username, avatarURL } = req.user;
  res.json({ _id, email, username, avatarURL });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({ message: "No content" });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const { username } = req.body;
  let avatarURL = req.user.avatarURL;

  if (req.file) {
    // Логіка збереження нового файлу (аналогічно реєстрації)
    const { path: oldPath, originalname } = req.file;
    const newPath = path.join(AVATARS_PATH, originalname);
    await fs.rename(oldPath, newPath);
    avatarURL = `avatars/${originalname}`;
  }

  const updatedUser = await User.findByIdAndUpdate(_id, { username, avatarURL }, { new: true });

  res.json({
    username: updatedUser.username,
    email: updatedUser.email,
    avatarURL: updatedUser.avatarURL,
  });
};

export default {
  registerUser: ctrlWrapper(registerUser),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  updateUser: ctrlWrapper(updateUser),
  loginUser: ctrlWrapper(loginUser), // ОБОВ'ЯЗКОВО
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),

};
