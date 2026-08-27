import { Post } from "../models/post.model.js";

const authorizePostOwner = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to modify this post",
    });
  }

  req.post = post;
  next();
};

export default authorizePostOwner;