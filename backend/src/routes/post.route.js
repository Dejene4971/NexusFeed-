import { Router } from "express";
import { createPost, getAllPosts, getPostById, updatePost, deletePost} from "../controllers/post.controller.js";
import authorizePostOwner from "../middlewares/authorizePostOwner.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import authenticateUser from "../middlewares/authenticateUser.js";
import { validatePost, validatePostQuery } from "../middlewares/validateRequest.js";

const postRouter = Router();

postRouter.route("/create").post(authenticateUser, validatePost, createPost);
postRouter.route("/getPosts").get(validatePostQuery, getAllPosts);
postRouter.route("/:id").get(validateObjectId, getPostById);
postRouter.route("/updatePost/:id").patch(authenticateUser, validateObjectId, authorizePostOwner, validatePost, updatePost);
postRouter.route("/deletePost/:id").delete(authenticateUser, validateObjectId, authorizePostOwner, deletePost);
// patch is used to update a resource partially,
// while put is used to update a resource completely.   



// POST endpoints will go here
postRouter.get("/", (req, res) => {
    res.json({ message: "Posts endpoint" });
});

export default postRouter;
