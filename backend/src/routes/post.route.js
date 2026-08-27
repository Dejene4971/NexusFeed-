import { Router } from "express";
import { createPost, getAllPosts, updatePost, deletePost} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.route("/create").post(createPost);
postRouter.route("/getPosts").get(getAllPosts);
postRouter.route("/updatePost/:id").patch(updatePost);
postRouter.route("/deletePost/:id").delete(deletePost);
// patch is used to update a resource partially,
// while put is used to update a resource completely.   



// POST endpoints will go here
postRouter.get("/", (req, res) => {
    res.json({ message: "Posts endpoint" });
});

export default postRouter;
