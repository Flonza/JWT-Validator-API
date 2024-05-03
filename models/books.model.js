import mysql from "mysql2/promise";
import bcryptjs from "bcryptjs";

const sqlConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "librery_app",
};

const pool = mysql.createPool(sqlConfig);

export class BooksModel {
  static getBooks = async ({ input }) => {
    try {
      const books = await pool.query("SELECT * FROM libr_books");
      //   if (id || name || gender || fec_publication || author) {
      //     books = await pool.query(
      //       "SELECT * FROM BOOKS WHERE id = ? OR name LIKE '?' "
      //     );
      //   } else {
      //     books = await pool.query("SELECT * FROM BOOKS");
      //   }
      return {
        header: "Search success",
        statusCode: 200,
        response: books[0],
        success: true,
        severity: "success",
      };
    } catch (e) {
      console.log(e);
    }
  };
}
