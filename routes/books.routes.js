import { Router } from "express";
import { BooksController } from "../controllers/books.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

export const BooksRouter = Router();

BooksRouter.use(verifyToken);

BooksRouter.get("/", verifyJWT, (req, res) => {
  BooksController.getBooks(req, res);
});
