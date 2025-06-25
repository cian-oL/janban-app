import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute";
import issueRoute from "./routes/issueRoute";
import projectRoute from "./routes/projectRoute";

const PORT = parseInt(process.env.SERVER_PORT || "", 10) || 8080;

// Use e2e database if running e2e environment
const defaultDbName =
  process.env.NODE_ENV === "e2e" ? "janban-e2e" : "janban-app";

const dbConnection =
  (process.env.MONGO_DB_CONNECTION_STRING as string) ||
  `mongodb://root:example@localhost:27017/${defaultDbName}?authSource=admin`;

mongoose
  .connect(dbConnection as string)
  .then(() => {
    if (process.env.NODE_ENV === "e2e") {
      console.log("Database connected for e2e testing");
    } else {
      console.log("Database connected successfully");
    }
  })

  .catch((err) => {
    console.log("Database failed to connect: ", err);
    process.exit(1);
  });

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL as string,
        "https://www.janban.dev",
        "https://janban.dev",
      ];

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/issues", issueRoute);
app.use("/api/projects", projectRoute);

app.use("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server listening on port ${PORT}`)
);
