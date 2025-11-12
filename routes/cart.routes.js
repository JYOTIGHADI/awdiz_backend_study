// import { Router } from "express";

// const cartRouter = Router();

// cartRouter.get("/addcart", (req, res) => {
//   res.send(" This is the Add to Cart Route");
// });

// export default cartRouter;


import { Router } from "express";
import {
  addToCart,
  getUserCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const CartRouter = Router();

// Add product to cart
CartRouter.post("/add", addToCart);

// Get user cart
CartRouter.get("/getcart", getUserCart);
// Remove product from cart
CartRouter.post("/remove", removeFromCart);

export default CartRouter;