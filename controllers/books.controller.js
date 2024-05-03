import { BooksModel } from "../models/books.model.js";

export class BooksController {
  static getBooks = async (req, res) => {
    const { id, name, gender, fec_publication, author } = req.body;

    try {
      const result = await BooksModel.getBooks({ input: null });
      res.json(result);
    } catch (e) {
      console.log(e);
    }
  };

  static createBooks = async (req, res) => {};

  static updateBooks = async (req, res) => {};
  static deleteBook = async (req, res) => {};
}
