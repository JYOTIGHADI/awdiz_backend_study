import { Router } from "express";
import {
  AddProduct,
  getProductsForSeller,
} from "../controllers/seller.controllers.js";

const sellerRouter = Router();

sellerRouter.post("/add-product", AddProduct);
sellerRouter.get("/get-products", getProductsForSeller);

export default sellerRouter;