import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      default:"",
      type: String,
      required: true,
      unique: true,
    },
    username: {
      default:"",
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      default:"",
      required: true,
      unique:true
    },
    firstName: {
      type: String,
      default: "",
      required:true,
      unique:true,
    },
    lastName: {
      type: String,
      default: "",
      required:true,
      unique:true
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;