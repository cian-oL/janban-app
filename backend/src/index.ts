import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import issueRoute from "./routes/issueRoute";

const PORT = process.env.SERVER_PORT || 8080;
const dbConnection = process.env.MONGO_DB_CONNECTION_STRING;

mongoose
  .connect(dbConnection as string)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database failed to connect: ", err));

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

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
