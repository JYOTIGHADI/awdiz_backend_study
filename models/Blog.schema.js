import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  user: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  user: String,
  comment: String,
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema]
});

const blogSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    author: String,
    comments: [commentSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
