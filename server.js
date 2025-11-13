import express from "express";
import dotenv from "dotenv";
import mainRouter from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { tokenDecoder } from "./middlewares/tokenMiddlware.js";
import authRouter from "./routes/auth.routes.js";
import CartRouter from "./routes/cart.routes.js";
import productsRouter from "./routes/product.routes.js";





const app = express();
dotenv.config();
const corsOptions = {
  origin: "http://localhost:5173", // Allow only a specific origin
  credentials: true, // Enable cookies and credentials
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is up and running");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", tokenDecoder , mainRouter);
app.use("/api/v1/cart", CartRouter);
// app.use("/api/v1",  mainRouter);
app.use("/api/v1/products", productsRouter);



mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected!"));

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});