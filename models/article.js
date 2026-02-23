import mongoose from "mongoose";
import { handleSaveError } from "./hooks.js";

const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for article"],
    },
    description: {
      type: String,
      required: [true, "Set description for article"],
    },

    data: {
      type: Date,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    image: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true },
);

articleSchema.post("save", handleSaveError);

export const Article = model("article", articleSchema);
