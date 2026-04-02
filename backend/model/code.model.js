import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  userId: {
    type: required,   // Clerk userId or your auth userId
    required: true,
    index: true
  },

  code: {
    type: String,
    required: true
  },

  language: {
    type: String,   // js, python, cpp
    required: true
  },

  output: {
    type: String,
    default: ""
  },

  error: {
    type: String,
    default: ""
  }

}, { timestamps: true });

export default mongoose.model("CodeRun", codeSchema);