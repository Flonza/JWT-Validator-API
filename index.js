import express from "express";
import { CORS } from "./middlewares/CORS.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middlewares/verifyToken.js";
import { BooksRouter } from "./routes/books.routes.js";
import { AdminRoutes } from "./routes/admin/admin.routes.js";
import { AuthRouter } from "./routes/auth/auth.routes.js";
import { rateLimit } from "express-rate-limit";
import { AditionalInfoRouter } from "./routes/information-books/aditional.routes.js";
// import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3200;

app.disable("x-powered-by");
app.use(CORS);
app.use(express.json());

app.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "jwt", (err, auth) => {
    if (err) {
      res.status(403).json({
        header: "The token is invalid.",
        message: "The token is not valid",
        statusCode: 403,
        success: false,
        severity: "error",
      });
    } else {
      res.json({
        header: "All good, all correct",
        message: "Nothing to see here",
        statusCode: 200,
        success: true,
        severity: "success",
      });
    }
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limita cada IP a 100 solicitudes por ventana de 15 minutos
});

app.use(limiter);

app.use("/auth", (req, res, next) => {
  AuthRouter(req, res, next);
});

app.use("/books", (req, res, next) => {
  BooksRouter(req, res, next);
});
app.use("/admin", AdminRoutes);

app.use("/inf", AditionalInfoRouter);

app.listen(PORT, () => {
  console.log(`Escuchando solicitudes en el puerto ${PORT}`);
});
