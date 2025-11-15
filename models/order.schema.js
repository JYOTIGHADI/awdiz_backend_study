import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },

  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    },
  ],

  totalAmount: Number,
  status: { type: String, default: "Pending" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
