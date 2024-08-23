import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const PORT = process.env.SERVER_PORT || 8080;
const dbConnection = process.env.MONGO_DB_CONNECTION_STRING;

mongoose
  .connect(dbConnection as string)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database failed to connect: ", err));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
