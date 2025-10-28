import { Router } from "express";

const productRouter = Router();

productRouter.post("/create-product", (req, res) => {
  res.send("Create Product Route");
});

export default productRouter;