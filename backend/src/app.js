import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use(notFoundHandler);
app.use(errorHandler);


//example route: http://localhost:4000/api/v1/users/register
//example route: http://localhost:4000/api/v1/posts/create
//example route: http://localhost:4000/api/v1/posts/getPosts

export default app;