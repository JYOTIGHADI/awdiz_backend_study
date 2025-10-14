import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();


app.get("/", (req, res) => {
  console.log(process.env.NAME, "- process.env.NAME");
  console.log(process.env.MONGODB_URL, "- process.env.MONGODB_URL");

  
  process.env.NAME
    ? res.send(` Hello ${process.env.NAME}! Welcome to the Express server!`)
    : res.send(" Please check your .env file.");
});



app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
