import { Router } from "express";
import { adminJWT } from "../../middlewares/administrativeVJWT.js";

export const AdminRoutes = Router();

AdminRoutes.get("/check-jwt", adminJWT, (req, res) => {
  res.json({
    header: "VALIDATED TOKEN",
    message: "Login valid",
    severity: "success",
    statusCode: 200,
    success: true,
  });
});
