import { Router } from "express";
import { PublisherController } from "../../controllers/books/publisher.controller.js";

export const PublisherRouter = Router();

PublisherRouter.get("/", (req, res) => {
  PublisherController.getPublisher(req, res);
});
