import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { loginValidator, registerValidation } from "../schemas/user.schema.js";

export const AuthRouter = Router();

// REGISTER
AuthRouter.post("/register", registerValidation, (req, res) => {
  AuthController.createUser(req, res);
});

// LOGIN
AuthRouter.post("/login", loginValidator, (req, res) => {
  AuthController.loginUser(req, res);
});
