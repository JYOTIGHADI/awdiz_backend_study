import User from "../models/user.schema.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const loginUser = await User.findOne({ email, password });
    if (!loginUser) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "User login successfully" });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Error while logging in" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isUserExistForOne = await User.findOne({ email: email });
    console.log(isUserExistForOne, "isUserExistForOne");
    if (isUserExistForOne) {
      return res.status(400).send({ message: "Email already exists." });
    }
    const newUser = User({ name: name, email, password });

    await newUser.save();
    res.status(201).send({ message: "User Registered Successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: "Error in Registering user" });
  }
};



