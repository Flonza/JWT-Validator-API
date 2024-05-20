import mysql from "mysql2/promise";
import { filterBooksDinamic } from "../../util/query-validator.js";

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
    // Desestructuracion de los datos obtenidos del input
    const { title, rent, buy, publication_date, editorial, genres } = input;
    const dateToArray = publication_date
      ? publication_date.split(",")
      : undefined;
    const stringToarray =
      dateToArray[0] != "null"
        ? dateToArray.map((date) => new Date(date))
        : null;
    const date = stringToarray
      ? stringToarray.map((fecha) => fecha.getFullYear())
      : null;
    //Formateo de estos mismos dependiendo de la necesidad
    const generos = genres ? genres.split(",") : null;
    const genresJSON = generos[0] != "null" ? JSON.stringify(generos) : null;
    const comprar = buy != "null" ? buy * 1 : null;
    const rentar = rent != "null" ? rent * 1 : null;
    // Creacion de los filtros de busqueda deacuerdo al tipo de datos que sea
    const filters = [
      { name: "titulo", value: title, dataType: "str" },
      { name: "alquilar", value: rentar, dataType: "numb" },
      { name: "comprar", value: comprar, dataType: "numb" },
      {
        name: "fecha_publicacion",
        value: date,
        dataType: "arrayNumbers",
      },
      { name: "editorial", value: editorial, dataType: "number" },
      { name: "generos", value: genresJSON, dataType: "jsonArray" },
    ];

    // Limpieza de los filtros, cambiando los valores null entre comillas a undefined
    // para mejorar el sistema de filtrado
    filters.map((key) => {
      if (key.value == "null" || key.value == null) {
        key.value = undefined;
      }
    });
    // Try and catch para ejecutar la query
    try {
      const { query, params } = filterBooksDinamic(filters);
      let books = await pool.query(query, params);
      if (books[0].length < 1) {
        throw new Error("NO_BOOKS_FOUND");
      }
      return {
        header: "Search success",
        message: "Successful search",
        statusCode: 200,
        response: books[0],
        success: true,
        severity: "success",
      };
    } catch (e) {
      let response;

      switch (e.message) {
        case "NO_BOOKS_FOUND":
          response = {
            header: "No books found",
            message: "Sorry, no books were found matching your criteria.",
            statusCode: 404,
            response: [],
            success: false,
            severity: "warning",
          };
          break;
        default:
          response = {
            header: "Search error",
            message: "An unexpected error occurred while searching for books.",
            statusCode: 500,
            response: [],
            success: false,
            severity: "error",
          };
      }

      console.error(e);
      return response;
    }
  };

  static getBookByIdenficador = async ({ input }) => {
    const { identificador } = input;
    try {
      const book = await pool.query(
        "SELECT * FROM libr_books WHERE identificador = ?",
        [identificador]
      );
      if (book[0].length < 1) {
        throw new Error("BOOK_NOT_FOUND");
      }
      return {
        header: "Search success",
        message: "Successful search",
        statusCode: 200,
        response: book[0],
        success: true,
        severity: "success",
      };
    } catch (err) {
      let response;
      switch (err.message) {
        case "BOOK_NOT_FOUND":
          response = {
            header: "No books found",
            message: "Sorry, no books were found matching what the ID.",
            statusCode: 404,
            response: {
              url: "/",
            },
            success: false,
            severity: "warning",
          };
          break;
        default:
          response = {
            header: "Search error",
            message: "An unexpected error occurred while searching for books.",
            statusCode: 500,
            response: [],
            success: false,
            severity: "error",
          };
          console.log(err);
          return response;
      }
    }
  };
}
