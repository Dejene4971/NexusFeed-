import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    const normalizedUsername = username.trim ().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6 || password.length > 50) {
      return res
        .status(400)
        .json({ message: "Password must be between 6 and 50 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email is already in use" });
    }

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });

    const { password: _, __v, ...safeUser } = user.toObject();

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server authentication is not configured" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, __v, ...safeUser } = user.toObject();

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, message: "Login successful", user: safeUser });
  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res) => {
  return res
    .status(200)
    .clearCookie("token")
    .json({ success: true, message: "Logout successful" });
};

export { registerUser, loginUser, logoutUser };