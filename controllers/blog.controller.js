import Blog from "../models/Blog.schema.js";

export const replyToComment = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { user, reply } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

   
    if (!blog.comments[index]) {
      return res.status(404).json({ message: "Comment not found" });
    }

  
    if (!blog.comments[index].replies) {
      blog.comments[index].replies = [];
    }

    blog.comments[index].replies.push({
      user,
      reply,
      createdAt: new Date(),
    });

    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error posting reply", error: err });
  }
};
