import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  racfid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
});

const User = mongoose.model("User", UserSchema);

export default User;
