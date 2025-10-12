import express from "express";

const app = express();


app.get("/name", (req, res) => {
  res.send("Welcome to the Express server! Hello I'm Jyoti!");
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
