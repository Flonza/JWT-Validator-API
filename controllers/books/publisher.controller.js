import { PublisherModel } from "../../models/books/publisher.model.js";

export class PublisherController {
  static getPublisher = async (req, res) => {
    try {
      const result = await PublisherModel.getPublisher();
      res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error);
      return {
        header: "Internal server error",
        message: "Please, contact technical service.",
        success: false,
        statusCode: 500,
        severity: "error",
      };
    }
  };
}
