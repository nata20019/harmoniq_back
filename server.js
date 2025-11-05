import mongoose from "mongoose";

const DB_HOST = process.env.DB_HOST;

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log(`Server is running. Use our API on port: ${process.env.PORT}`);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
