import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

let users = [
  { id: 1, name: "Jyoti Ghadi", email: "jyoti@gmail.com" },
  { id: 2, name: "John Doe", email: "john@example.com" },

];


app.get("/", (req, res) => {
  process.env.NAME
    ? res.send(`Hello ${process.env.NAME}! Welcome to the Express server!`)
    : res.send("Please check your .env file.");
});


app.get("/users", (req, res) => {
  return res.status(200).json({
    message: "All users fetched successfully",
    data: users,
  });
});


app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: "Enter a valid User ID" });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({
    message: "User fetched successfully",
    data: { user },
  });
});


app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  return res.status(201).json({
    message: "User registered successfully",
    data: newUser,
  });
});


app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  return res.status(200).json({
    message: "User updated successfully",
    data: user,
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: "Provide a valid ID" });
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);

  return res.status(200).json(
    "User deleted successfully",
  );
});


app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
