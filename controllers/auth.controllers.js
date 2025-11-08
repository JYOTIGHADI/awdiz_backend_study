import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ----------------- REGISTER -----------------
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Please fill all required fields", 
        success: false 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        message: "User already exists", 
        success: false 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({
      message: "Registration successful!",
      success: true,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Internal server error during registration",
      success: false,
    });
  }
};

// ----------------- LOGIN -----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide both email and password", 
        success: false 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: "User not found", 
        success: false 
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Incorrect password", 
        success: false 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true // enable for HTTPS
    });

    return res.status(200).json({
      success: true,
      message: `Hello ${user.name}, you're logged in!`,
      user: { userId: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error during login",
      success: false,
    });
  }
};

// ----------------- GET CURRENT USER -----------------
export const getCurrentUser = async (req, res) => {
  try {
    // req.userId should be set by your auth middleware
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found", 
        success: false 
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user: { userId: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    return res.status(500).json({
      message: "Unauthorized or internal server error",
      success: false,
    });
  }
};
