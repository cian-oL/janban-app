import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import issueRoute from "./routes/issueRoute";
import projectRoute from "./routes/projectRoute";

const PORT = parseInt(process.env.SERVER_PORT || "", 10) || 8080;
const dbConnection =
  (process.env.MONGO_DB_CONNECTION_STRING as string) ||
  "mongodb://root:example@localhost:27017/janban-app?authSource=admin";

mongoose
  .connect(dbConnection as string)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.log("Database failed to connect: ", err);
    process.exit(1);
  });

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);
app.use("/api/projects", projectRoute);

app.use("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server listening on port ${PORT}`)
);
