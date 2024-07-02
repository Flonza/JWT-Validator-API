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

export class AdminAuthModel {
  static async loginAdmin({ input }) {
    try {
      const { user, password } = input;
      const logedUser = await pool.query(
        `SELECT * FROM core_admin WHERE user = ? OR email = ?`,
        [user, user]
      );
      if (logedUser[0].length < 1) {
        throw new Error("User or email is not registered.");
      }
      const compare = await bcryptjs.compare(password, logedUser[0][0].clave);
      if (!compare) {
        throw new Error("Invalid credentials.");
      }

      const salt = await bcryptjs.genSalt(7);
      const userHash = await bcryptjs.hash(user, salt);
      const key = jsonwebtoken.sign(
        { val: userHash },
        process.env.JWT_SECRET_KEY_ADMIN_VALID_VALUE,
        { expiresIn: process.env.JWT_EXPIRE_TIME }
      );

      return {
        header: "Exito iniciando sesion",
        message: `Welcome.`,
        response: {
          key: key,
        },
        statusCode: 200,
        success: true,
        severity: "success",
      };
    } catch (error) {}
  }

  static registerAdmin = async ({ input }) => {
    try {
      const { user, name, lastName, email, password, keyVal } = input;
      let fk = 0;
      if (keyVal === process.env.ROL_EDITOR_KEY) {
        fk = 2;
      } else if (keyVal === process.env.ROL_SUPERADMIN_KEY) {
        fk = 1;
      } else {
        throw Error("Permission denied");
      }

      const idResult = await pool.query("SELECT UUID() uuid");
      const [[{ uuid }]] = idResult;
      await pool.query(
        `
      INSERT INTO core_admin (ID, user, name, lastName, fk_rol, clave, email) VALUES
      (uuid_to_bin(?), ?, ?, ?, ?, ?, ?)
      `,
        [uuid, user, name, lastName, fk, password, email]
      );
      const salt = await bcryptjs.genSalt(7);
      const userHash = await bcryptjs.hash(user, salt);
      const key = jsonwebtoken.sign(
        { val: userHash },
        process.env.JWT_SECRET_KEY_ADMIN_VALID_VALUE,
        { expiresIn: process.env.JWT_EXPIRE_TIME }
      );
      return {
        header: "Exito creando el nuevo usuario",
        message: `Welcome`,
        response: {
          token: key,
        },
        statusCode: 200,
        success: true,
        severity: "success",
      };
    } catch (error) {
      console.log(error);
      return {
        header: "Permission denied",
        message: error.message,
        success: false,
        response: null,
        statusCode: 400,
        severity: "warn",
      };
    }
  };
}
