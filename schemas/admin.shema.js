import { check } from "express-validator";
import { validatorResult } from "../helpers/validateHelper.js";

// Array de validaciones para el registro
export const registerAdminValidator = [
  check("name").exists().notEmpty().isString(),
  check("lastName").exists().notEmpty().isString(),
  check("user").exists().notEmpty().isString(),
  check("email").exists().notEmpty().isEmail(),
  check("keyVal").exists().notEmpty().isString(),
  check("password")
    .exists()
    .isLength({ min: 8 })
    .notEmpty()
    .isString()
    .custom((value, { req }) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d.*\d.*\d)/; //;
      if (regex.test(value) == false) {
        throw new Error(
          "The password must have at least 1 uppercase letter, 1 lowercase letter, and 4 numbers"
        );
      }
      return true;
    }), // Llamada a la función de validación personalizada
  (req, res, next) => {
    validatorResult(req, res, next);
  },
];

export const loginAdminValidator = [
  check("user")
    .exists()
    .notEmpty()
    .withMessage("The user couldnt be null or undefined")
    .isString(),
  check("password")
    .exists()
    .notEmpty()
    .withMessage("The password couldnt be null or undefined")
    .isString(),
  (req, res, next) => {
    validatorResult(req, res, next);
  },
];
