import express from "express";

import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";


import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts. Try again later.",
  },
});
app.use(limiter);


app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use(notFoundHandler);
app.use(errorHandler);


//example route: http://localhost:4000/api/v1/users/register
//example route: http://localhost:4000/api/v1/posts/create
//example route: http://localhost:4000/api/v1/posts/getPosts

export default app;