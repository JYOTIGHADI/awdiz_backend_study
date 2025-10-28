import { Router } from "express";

const cartRouter = Router();

cartRouter.get("/addcart", (req, res) => {
  res.send(" This is the Add to Cart Route");
});

export default cartRouter;