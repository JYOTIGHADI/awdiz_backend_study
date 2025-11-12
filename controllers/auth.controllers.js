// import User from "../models/user.schema.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// // ----------------- REGISTER -----------------
// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body || {};

//     // Validate input
//     if (!name || !email || !password) {
//       return res.status(400).json({ 
//         message: "Please fill all required fields", 
//         success: false 
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ 
//         message: "User already exists", 
//         success: false 
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save new user
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     return res.status(201).json({
//       message: "Registration successful!",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     return res.status(500).json({
//       message: "Internal server error during registration",
//       success: false,
//     });
//   }
// };

// // ----------------- LOGIN -----------------
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ 
//         message: "Please provide both email and password", 
//         success: false 
//       });
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ 
//         message: "User not found", 
//         success: false 
//       });
//     }

//     // Compare password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         message: "Incorrect password", 
//         success: false 
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     // Set token as httpOnly cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       // secure: true // enable for HTTPS
//     });

//     return res.status(200).json({
//       success: true,
//       message: `Hello ${user.name}, you're logged in!`,
//       user: { userId: user._id, name: user.name, email: user.email },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.status(500).json({
//       message: "Internal server error during login",
//       success: false,
//     });
//   }
// };

// // ----------------- GET CURRENT USER -----------------
// export const getCurrentUser = async (req, res) => {
//   try {
//     // req.userId should be set by your auth middleware
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ 
//         message: "User not found", 
//         success: false 
//       });
//     }

//     return res.status(200).json({
//       message: "User fetched successfully",
//       success: true,
//       user: { userId: user._id, name: user.name, email: user.email },
//     });
//   } catch (error) {
//     console.error("GetCurrentUser Error:", error);
//     return res.status(500).json({
//       message: "Unauthorized or internal server error",
//       success: false,
//     });
//   }
// };




import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";
import Seller from "../models/seller.schema.js";

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required.", success: false });
    }

    // Check if user or seller already exists
    const existing =
      role === "user"
        ? await User.findOne({ email })
        : role === "seller"
        ? await Seller.findOne({ email })
        : null;

    if (existing) {
      return res
        .status(400)
        .json({ message: "Email already exists.", success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new record
    if (role === "user") {
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "User registered successfully.", success: true });
    } else if (role === "seller") {
      const newSeller = new Seller({ name, email, password: hashedPassword });
      await newSeller.save();
      return res
        .status(201)
        .json({ message: "Seller registered successfully.", success: true });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid role type.", success: false });
    }
  } catch (error) {
    console.error("Error in Register:", error);
    return res
      .status(500)
      .json({ message: "Server error during registration.", success: false });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required.", success: false });
    }

    // Find user or seller
    let account = await User.findOne({ email });
    let role = "user";

    if (!account) {
      account = await Seller.findOne({ email });
      role = "seller";
    }

    if (!account) {
      return res.status(404).json({ message: "Email not found.", success: false });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid password.", success: false });
    }

    // Generate token
    const token = jwt.sign(
      { userId: account._id, role },
      process.env.JWT_SECRET
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // enable in production
    });

    return res.status(200).json({
      message: "Login successful.",
      success: true,
      user: { name: account.name, userId: account._id, role },
    });
  } catch (error) {
    console.error("Error in Login:", error);
    return res
      .status(500)
      .json({ message: "Server error during login.", success: false });
  }
};

// ---------------- GET CURRENT USER ----------------
export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Token missing.", success: false });
    }

    let user = await User.findById(userId);
    let role = "user";

    if (!user) {
      user = await Seller.findById(userId);
      role = "seller";
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    return res.status(200).json({
      message: "User fetched successfully.",
      success: true,
      user: { name: user.name, userId: user._id, role },
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching user.", success: false });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ success: true, message: "Logout successful." });
  } catch (error) {
    console.error("Error in Logout:", error);
    return res
      .status(500)
      .json({ message: "Server error during logout.", success: false });
  }
};
