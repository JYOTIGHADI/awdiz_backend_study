import jwt from "jsonwebtoken";

export const tokenDecoder = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedToken.userId;
    }
    next();
  } catch (error) {
    console.log(error, "tokenDecoder error");
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};