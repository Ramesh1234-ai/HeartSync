import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  content: {
    type: String,   // store file text
    required: true
  },
  language: {
    type: String,   // optional: js, py, java
    default: ""
  }
}, { timestamps: true });
export default mongoose.model("File", fileSchema);