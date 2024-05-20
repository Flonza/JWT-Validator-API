import { Router } from "express";
import { BooksController } from "../controllers/books/books.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { PublisherRouter } from "./information-books/publisher.routes.js";
import { filteredBooksValidator } from "../schemas/book.schema.js";

export const BooksRouter = Router();

BooksRouter.get("/", (req, res) => {
  BooksController.getBooks(req, res);
});

BooksRouter.use("/publishers", (req, res, next) => {
  PublisherRouter(req, res, next);
});

BooksRouter.get("/:id", (req, res) => {
  BooksController.getOneBook(req, res);
});
