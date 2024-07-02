import { Router } from "express";
import { UserAuthController } from "../../../controllers/auth/user-auth.controller.js";
import {
  loginValidator,
  registerValidation,
} from "../../../schemas/user.schema.js";

export const UserAuthRouter = Router();

// REGISTER
UserAuthRouter.post("/register", registerValidation, (req, res) => {
  UserAuthController.createUser(req, res);
});

// LOGIN
UserAuthRouter.post("/login", loginValidator, (req, res) => {
  UserAuthController.loginUser(req, res);
});
