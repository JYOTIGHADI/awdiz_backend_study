import { Router } from "express";
import { createProduct } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/create-product", createProduct);

export default productRouter;