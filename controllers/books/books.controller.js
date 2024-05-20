import { BooksModel } from "../../models/books/books.model.js";

export class BooksController {
  static getBooks = async (req, res) => {
    const { title, rent, buy, publication_date, genres, editorial } = req.query;
    const input = {
      title,
      rent,
      buy,
      publication_date,
      genres,
      editorial,
    };
    try {
      const result = await BooksModel.getBooks({ input: input });
      res.json(result);
    } catch (e) {
      console.log(e);
    }
  };

  static getOneBook = async (req, res) => {
    const { id } = req.params;
    const input = {
      identificador: id,
    };
    try {
      const result = await BooksModel.getBookByIdenficador({
        input,
      });
      res.json(result);
    } catch (e) {
      console.log(e);
    }
  };

  static createBooks = async (req, res) => {};

  static updateBooks = async (req, res) => {};
  static deleteBook = async (req, res) => {};
}
