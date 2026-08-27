import { Post } from "../models/post.model.js";

const authorizePostOwner = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      return next(error);
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("You are not authorized to perform this action");
      error.statusCode = 403;
      return next(error);
    }

    req.post = post;
    next();
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export default authorizePostOwner;
