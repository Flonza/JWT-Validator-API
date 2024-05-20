import mysql from "mysql2/promise";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotnev from "dotenv";

dotnev.config();

const sqlConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "librery_app",
};

const pool = mysql.createPool(sqlConfig);

export class AuthModel {
  // Funcion para crear un nuevo usuario (Registrar)
  static createNewUser = async ({ input }) => {
    try {
      const idResult = await pool.query("SELECT UUID() uuid");
      const [[{ uuid }]] = idResult;

      const { name, lastName, username, email, password } = input;

      // Verificar si el username o email ya existen
      const existingUser = await pool.query(
        `SELECT * FROM core_users WHERE username = ? OR email = ?`,
        [username, email]
      );

      if (existingUser[0].length > 0) {
        // Si se encuentra un usuario, arrojar un error
        throw new Error(
          "The user or email is already registered, please try another one."
        );
      }

      await pool.query(
        `
          INSERT INTO core_users (id, name, lastname, username, email, clave) 
          VALUES(UUID_TO_BIN(?), ?, ?, ?, ?, ?)
        `,
        [uuid, name, lastName, username, email, password]
      );

      const newUser = await pool.query(
        `SELECT username, CONCAT(name, " " , lastName) as fullName FROM core_users WHERE id = UUID_TO_BIN(?)`,
        [uuid]
      );

      const salt = await bcryptjs.genSalt(7);
      const userHash = await bcryptjs.hash(username, salt);
      const key = jsonwebtoken.sign(
        { val: userHash },
        process.env.JWT_SECRET_VALID_VALUE,
        { expiresIn: process.env.JWT_EXPIRE_TIME }
      );
      return {
        header: "Exito creando el nuevo usuario",
        message: `Welcome, ${newUser[0][0].fullName}`,
        response: {
          token: key,
        },
        statusCode: 200,
        success: true,
        severity: "success",
      };
    } catch (error) {
      console.log(error);
      if (
        error.message ===
        "The user or email is already registered, please try another one."
      ) {
        // Puedes decidir devolver un código de estado 400 o 409 (Conflict)
        return {
          header: "The user or email already exist",
          message: error.message,
          success: false,
          response: null,
          statusCode: 400,
          severity: "warn",
        };
      } else {
        return {
          header: "Internal server error :(",
          message:
            "Opps, something went wront, contact someone from technical service",
          success: false,
          response: null,
          statusCode: 500,
          severity: "error",
        };
      }
    }
  };

  static async loginUser({ input }) {
    try {
      const { user, password } = input;
      const logedUser = await pool.query(
        `SELECT * FROM core_users WHERE username = ? OR email = ?`,
        [user, user]
      );
      if (logedUser[0].length < 1) {
        throw new Error("User or email is not registered.");
      }
      const compare = await bcryptjs.compare(password, logedUser[0][0].clave);
      if (!compare) {
        throw new Error("Invalid credentials.");
      }

      const fullName = `${logedUser[0][0].name} ${logedUser[0][0].lastName}`;
      const salt = await bcryptjs.genSalt(7);
      const userHash = await bcryptjs.hash(user, salt);
      const key = jsonwebtoken.sign(
        { val: userHash },
        process.env.JWT_SECRET_VALID_VALUE,
        { expiresIn: process.env.JWT_EXPIRE_TIME }
      );

      return {
        header: "Exito iniciando sesion",
        message: `Welcome, ${fullName}`,
        response: {
          key: key,
        },
        statusCode: 200,
        success: true,
        severity: "success",
      };
    } catch (e) {
      console.log(e);
      let response;
      switch (e.message) {
        case "User or email is not registered.":
          response = {
            header: "Authentication Failed",
            message: "The username or email does not exist.",
            success: false,
            statusCode: 404,
            severity: "warn",
          };
          break;
        case "Invalid credentials.":
          response = {
            header: "Authentication Failed",
            message: "The credentials provided are invalid.",
            success: false,
            statusCode: 401,
            severity: "error",
          };
          break;
        default:
          response = {
            header: "Server Error",
            message:
              "Oops, something went wrong, please contact technical support.",
            success: false,
            statusCode: 500,
            severity: "error",
          };
      }
      return response;
    }
  }
}
