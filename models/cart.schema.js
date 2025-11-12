import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    
  },
  { timestamps: true }
);

const Cart = mongoose.model("carts", CartSchema);

export default Cart;