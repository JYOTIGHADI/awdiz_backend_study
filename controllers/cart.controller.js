import Cart from "../models/cart.schema.js";
import Product from "../models/product.schema.js";

// ✅ Add product to cart (requires auth middleware that sets req.userId)
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.user; // ✅ Comes from verified JWT
    console.log(req.userId);
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID or product ID missing.",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [productId],
      });
    } else {
      // Prevent duplicates
      const alreadyInCart = cart.products.some(
        (p) => p.toString() === productId.toString()
      );

      if (alreadyInCart) {
        return res.status(200).json({
          success: true,
          message: "Product already in cart.",
          cart,
        });
      }

      cart.products.push(productId);
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      cart,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding to cart.",
    });
  }
};

// ✅ Get user's cart (auto-detected via token)
export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.user;

    const cart = await Cart.findOne({ user: userId }).populate("products");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Your cart is empty.",
        cart: { products: [] },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully.",
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching cart.",
    });
  }
};

// ✅ Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    cart.products = cart.products.filter(
      (p) => p.toString() !== productId.toString()
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart.",
      cart,
    });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error removing from cart.",
    });
  }
};