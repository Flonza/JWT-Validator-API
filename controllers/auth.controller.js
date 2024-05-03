import bcryptjs from "bcryptjs";
import { AuthModel } from "../models/auth.model.js";
import dotnev from "dotenv";

dotnev.config();

export class AuthController {
  //-----------------------------------------------------------------------------------
  //METODO DE CREACION O REGISTROS DE USUARIOS
  //-----------------------------------------------------------------------------------
  static createUser = async (req, res) => {
    const { name, lastName, username, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashPs = await bcryptjs.hash(password, salt);

    const newUser = {
      name,
      lastName,
      username,
      email,
      password: hashPs,
    };
    try {
      // Espera la respuesta de createNewUser usando await o maneja la promesa devuelta
      const result = await AuthModel.createNewUser({ input: newUser });
      const key = result.response;
      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 60 * 60 * 1000
        ),
        path: "/",
      };
      res.cookie("jwt", key.key, cookieOptions);
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        header: "Something went wront in the creation.",
        message: "Make sure that all fields are correct",
        response: null,
        statusCode: 403,
        success: false,
        severity: "error",
      }); // Envía un mensaje de error al cliente
    }
  };

  static async loginUser(req, res) {
    const { user, password } = req.body;
    const logUser = {
      user: user,
      password: password,
    };
    try {
      const result = await AuthModel.loginUser({ input: logUser });
      const key = result.response;
      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ),
        path: "/",
      };
      res.cookie("jwt", key.key, cookieOptions);
      res.status(202).json(result);
    } catch (err) {
      res.status(500).json({
        header: "Something went wront in the login.",
        message: "Make sure that all fields are correct",
        response: null,
        statusCode: 403,
        success: false,
        severity: "error",
      });
    }
  }
}
