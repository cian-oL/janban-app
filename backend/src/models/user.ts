import mongoose from "mongoose";
import { hashPassword } from "../utils/user";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  racfid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, required: true },
  lastUpdated: { type: Date, required: true },
});

const User = mongoose.model("User", UserSchema);

export default User;
