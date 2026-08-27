import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authenticateUser = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;
    const cookieToken = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("token="))
      ?.slice(6);
    const token = bearerToken || cookieToken;

    if (!token || !process.env.JWT_SECRET) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      return next(error);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      const error = new Error("User no longer exists");
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message = "Invalid or expired token";
    next(error);
  }
};

export default authenticateUser;