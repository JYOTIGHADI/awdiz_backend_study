import { Router } from "express";
import authRouter from "./auth.routes.js";
import CartRouter from "./cart.routes.js";
import productsRouter from "./product.routes.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/carts", CartRouter);

export default mainRouter;