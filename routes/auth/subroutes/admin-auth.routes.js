import { Router } from "express";
import { AdminAuthController } from "../../../controllers/auth/admin-auth.controller.js";
import {
  loginAdminValidator,
  registerAdminValidator,
} from "../../../schemas/admin.shema.js";

export const AdminAuthRoutes = Router();

AdminAuthRoutes.post("/register", registerAdminValidator, (req, res) => {
  AdminAuthController.createAdmin(req, res);
});

AdminAuthRoutes.post("/login", loginAdminValidator, (req, res) => {
  AdminAuthController.getLoginAdmin(req, res);
});
