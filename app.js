import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import articlesRouter from "./routes/articlesRouter.js";
import e from "express";

const { PORT = 5000 } = process.env;
const app = express();

app.use(morgan("tiny"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Дозволяє надсилати куки
  }),
);
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use("/api/articles", articlesRouter);
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
