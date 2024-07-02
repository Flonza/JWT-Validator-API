import { Router } from "express";
import { UserAuthRouter } from "./subroutes/user-auth.routes.js";
import { AdminAuthRoutes } from "./subroutes/admin-auth.routes.js";

export const AuthRouter = Router();

AuthRouter.use("/users", UserAuthRouter);

AuthRouter.use("/admin", AdminAuthRoutes);
