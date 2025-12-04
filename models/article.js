import mongoose from "mongoose";
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
  },
  { versionKey: false, timestamps: true }
);

articleSchema.post("save", function (error, doc, next) {
  error.status = 409;
  next();
});

export const Article = model("article", articleSchema);
