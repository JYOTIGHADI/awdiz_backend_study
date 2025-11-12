import Product from "../models/product.schema.js";

export const AddProduct = async (req, res) => {
  try {
    const { name, price, category, quantity, imgUrl } = req.body;

    const userId = req.userId;
    const newProduct = Product({
      name,
      price,
      category,
      quantity,
      imgUrl,
      seller: userId,
    });
    await newProduct.save();
    return res.json({
      success: true,
      message: "Product successfully created.",
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .send({ message: "Error in getting current user", success: false });
  }
};

export const getProductsForSeller = async (req, res) => {
  try {
    const userId = req.userId;
    const products = await Product.find({ seller: userId, isDeleted: false });
    return res.json({ success: true, products });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .send({ message: "Error in getting current user", success: false });
  }
};