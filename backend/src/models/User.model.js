import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    clearkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    profileImageUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

const User = model("User", userSchema);

export default User;
