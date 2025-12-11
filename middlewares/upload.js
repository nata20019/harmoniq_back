import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";

const TEMP_DIR = path.resolve("temp");

const storage = multer.diskStorage({
  destination: TEMP_DIR,
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniquePrefix + "-" + file.originalname;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(HttpError(400, "Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
