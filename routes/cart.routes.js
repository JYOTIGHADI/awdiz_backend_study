
import { Router } from "express";
import {
  addToCart,
  getUserCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const CartRouter = Router();

// Add product to cart
CartRouter.post("/add", verifyToken, addToCart);

// Get user cart
CartRouter.get("/getcart", verifyToken, getUserCart);
// Remove product from cart
CartRouter.post("/remove", verifyToken, removeFromCart);

export default CartRouter;

