
  import { Router, text } from "express";
  import {
    addProduct,
    deleteProducts,
    editProducts,
    getAllProducts,
    getFilterAllProducts,
  } from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

  const productsRouter = Router();

  productsRouter.post("/addproducts" , addProduct);
  productsRouter.get("/getproducts", getAllProducts);
  productsRouter.delete("/deleteproducts/:id", deleteProducts);
  productsRouter.put("/editproducts/:id", editProducts);
  productsRouter.get("/getallfilterproducts", verifyToken, getFilterAllProducts);

  export default productsRouter;
