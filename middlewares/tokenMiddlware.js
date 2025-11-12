import jwt from "jsonwebtoken";
export const tokenDecoder = (req, res, next) => {
  try {
    const openRoutes = [
      "/api/v1/auth/login",
      "/api/v1/auth/register",
      "/api/v1/products/get-products",
    ];

    // Skip middleware for certain routes
    if (openRoutes.includes(req.path)) {
      return next();
    }
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided", success: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "decoded token");
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .send({ message: "Error in decoding token", success: false });
  }
};