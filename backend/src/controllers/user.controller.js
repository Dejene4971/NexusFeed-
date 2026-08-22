import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    // Create new user
    const newUser = await User({ 
        username, 
        password, 
        email: email.toLowerCase(), 
    });
    await newUser.save();

    res.status(201).json({ 
        message: "User registered successfully",
        newUser: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        }

    
    });
  } 
  catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser };