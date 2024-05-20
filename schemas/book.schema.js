import { check } from "express-validator";
import { validateSearch } from "../helpers/validateHelper.js";

export const filteredBooksValidator = [
  check("title").optional().isString(),
  check("rent").optional().isNumeric(),
  check("buy").optional().isNumeric(),
  check("publication_date").optional().isArray(),
  check("genres").optional().isArray(),
  check("editorial").optional().isString(),
  (req, res, next) => {
    validateSearch(req, res, next);
  },
];
