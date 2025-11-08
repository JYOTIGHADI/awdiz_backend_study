import express from "express";
import dotenv from "dotenv";
import mainRouter from "./routes/index.js";
import mongoose from 'mongoose';
import core from 'cors';
import cookieParser from "cookie-parser";
import { tokenDecoder } from "./middlewares/tokenMiddlware.js";


const app = express();
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173", // Allow only a specific origin
  credentials: true, // Enable cookies and credentials
};
app.use(express.json());
app.use(core(corsOptions));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.use("/api/v1", tokenDecoder, mainRouter);

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log(' Hello Jyoti, database is Connected!'));

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});