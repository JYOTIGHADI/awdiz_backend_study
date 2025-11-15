
import Cart from "../models/cart.schema.js";
import Product from "../models/product.schema.js";

// Add product to cart


export const addToCart = async (req, res) => {
  try {
    console.log("---- Add to Cart Request ----");
    console.log("req.user:", req.user); // check if user info exists

    const userId = req.user?.id; // make sure this matches your JWT payload
    const { productId } = req.body;

    //  Validate userId and productId
    if (!userId) {
      console.log("❌ User ID missing. Token not sent or invalid.");
      return res
        .status(401)
        .json({ success: false, message: "User not logged in" });
    }

    if (!productId) {
      console.log("❌ Product ID missing in request body.");
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Product not found:", productId);
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check if user already has a cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log("Creating new cart for user:", userId);
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
        console.log("Incremented quantity for product:", productId);
      } else {
        cart.items.push({ productId, quantity: 1 });
        console.log("Added new product to cart:", productId);
      }
    }

    await cart.save();

    console.log("✅ Cart saved successfully");
    res.status(200).json({
      success: true,
      message: "Product added to cart successfully!",
      cart,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding to cart.",
      error: error.message,
    });
  }
};

// Get user cart
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price category brand imageUrl description createdAt",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Your cart is empty.",
        cart: { items: [] },
      });
    }

    // Remove deleted products
    const validItems = cart.items.filter((item) => item.productId !== null);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully.",
      cart: { items: validItems },
    });
  } catch (err) {
    console.error("Get Cart Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching cart.",
      error: err.message,
    });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "title price category brand imageUrl description createdAt",
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart.",
      cart,
    });
  } catch (err) {
    console.error("Remove from Cart Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error removing from cart.",
      error: err.message,
    });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // fetch user cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let orderItems = [];
    let totalAmount = 0;

    for (let item of cart.items) {
      const product = item.productId;

      // Check stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.title} does not have enough stock`,
        });
      }

      // Deduct stock
      product.quantity -= item.quantity;
      await product.save();

      // Prepare order product list
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId,
      sellerId: orderItems[0].sellerId, // if single seller
      products: orderItems,
      totalAmount,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller.id;

    const orders = await Order.find({ sellerId })
      .populate("userId", "name email")
      .populate("products.productId", "title price imageUrl");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
