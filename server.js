import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());


const users = [];


app.get("/", (req, res) => {
  console.log(process.env.NAME, "process.env.NAME");
  console.log(process.env.MONGODB_URL, " process.env.MONGODB_URL");

  process.env.NAME
    ? res.send(`Hello ${process.env.NAME}! Welcome to the Express server!`)
    : res.send("Please check your .env file.");
});


app.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      return res.send("All fields are required");
    }


    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.send("User already exists");
    }

    users.push({ name, email, password });
    res.send(" User Registered successfully");
  } catch (err) {
    console.error(err);
    res.send("Internal server error");
  }
});

app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.send("Email and password are required");
    }

    const existingUser = users.find((u) => u.email === email);
    if (!existingUser || existingUser.password !== password) {
      return res.send("Invalid credentials");
    }

    res.send("User Login successfully");
  } catch (err) {
    console.error(err);
    res.send("Internal server error");
  }
});


app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
