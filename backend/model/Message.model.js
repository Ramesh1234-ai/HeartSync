import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: clerkClient, // Clerk userId or your auth userId
      required: true,
      index: true
    },
    title: {
      type: String,
      default: "",
      trim: true,
      required:true
    },
    content: {
      type: String, // actual message text
      required: true
    }
  },
  {
    timestamps: true
  }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;