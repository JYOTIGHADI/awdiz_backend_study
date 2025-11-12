// import express, { Router } from "express";
// import { getCurrentUser, login, register } from "../controllers/auth.controllers.js";
// import { tokenDecoder } from "../middlewares/tokenMiddlware.js";
// const authRoute = Router();

// authRoute.use(express.json());

// authRoute.post("/login", login);

// authRoute.post("/register", register);


// authRoute.get("/get-current-user", tokenDecoder, getCurrentUser);

// export default authRoute;

import { Router } from "express";
import {
  login,
  register,
  getCurrentUser,
  logout,
} from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get("/get-current-user", getCurrentUser);
authRouter.get("/logout", logout);

export default authRouter;