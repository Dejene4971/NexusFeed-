import { Router } from "express";

const postRouter = Router();

// POST endpoints will go here
postRouter.get("/", (req, res) => {
    res.json({ message: "Posts endpoint" });
});

export default postRouter;
