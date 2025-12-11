import mongoose from "mongoose";
import { handleSaveError } from "./hooks.js";

const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for article"],
    },
    describe: {
      type: String,
      required: [true, "Set description for article"],
    },
    photoURL: String,
    data: {
      type: Date,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

articleSchema.post("save", handleSaveError);

export const Article = model("article", articleSchema);
