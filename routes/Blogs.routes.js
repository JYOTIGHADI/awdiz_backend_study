import express from "express";
import Blog from "../models/Blog.schema.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { title, text, author } = req.body;
    const blog = new Blog({ title, text, author });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post("/:id/comments", async (req, res) => {
  try {
    const { user, comment } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ user, comment });
    await blog.save();

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post("/:id/comments/:index/reply", async (req, res) => {
  try {
    const { id, index } = req.params;
    const { user, reply } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments[index];
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }


    if (!comment.replies) comment.replies = [];

    comment.replies.push({
      user,
      reply,
      createdAt: new Date(),
    });

    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
