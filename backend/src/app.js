import express from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";


import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import swaggerDocument from "./config/swagger.js";

const app = express();
app.use(express.json({ limit: "10kb" }));
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: Access denied from this origin"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many authentication attempts. Try again later.",
  },
});
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);


app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

app.use(notFoundHandler);
app.use(errorHandler);


//example route: http://localhost:4000/api/v1/users/register
//example route: http://localhost:4000/api/v1/posts/create
//example route: http://localhost:4000/api/v1/posts/getPosts

export default app;