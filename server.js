import express from "express";

const app = express();


app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

app.post("/name", (req,res) =>{
  res.send("hey i'm Jyoti")
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
