import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { AVATARS_PATH } from "../constants/index.js";
import sendEmail from "../helpers/sendEmail.js";
import "dotenv/config";

const { JWT_SECRET } = process.env;

const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: "Verify your email",
  html: `<a target="_blank" href="${process.env.SERVER_URL}/api/auth/verify/${verificationToken}">Click to verify your email</a>`,
});

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Це req.body:", req.body);

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    let avatarURL;
    if (!req.file) {
      avatarURL = gravatar.url(email);
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
    await sendEmail(verifyEmail);

    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path);
    }
    throw error;
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
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({ message: "No content" });
};

export default {
  registerUser,
  verifyEmail,
  resendVerifyEmail,
  loginUser,
  getCurrent,
  logout,
};
