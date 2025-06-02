import mongoose from "mongoose";
import { hashPassword } from "../utils/user";

const UserSchema = new mongoose.Schema({
  racfid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  createdAt: { type: Date, required: true },
  lastUpdated: { type: Date, required: true },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
