// import { Router } from "express";
// import {
//   addProduct,
//   getAllProducts,
//   getProductDetails,
// } from "../controllers/product.controller.js";

// const productRouter = Router();

// productRouter.post("/create-product", addProduct);

// productRouter.get("/get-products", getAllProducts);


// productRouter.get("/product-details/:id", getProductDetails);

// export default productRouter;



  import { Router } from "express";
  import {
    addProduct,
    deleteProducts,
    editProducts,
    getAllProducts,
    getFilterAllProducts,
  } from "../controllers/product.controller.js";

  const productsRouter = Router();

  productsRouter.post("/addproducts", addProduct);
  productsRouter.get("/getproducts", getAllProducts);
  productsRouter.delete("/deleteproducts/:id", deleteProducts);
  productsRouter.put("/editproducts/:id", editProducts);
  productsRouter.get("/getallfilterproducts", getFilterAllProducts);

  export default productsRouter;
