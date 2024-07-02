import { validationResult } from "express-validator";

export const validatorResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (e) {
    res.status(403).json({
      header: "Something went wront in the validation.",
      message: "Make sure that all fields are completed",
      statusCode: 403,
      success: false,
      severity: "error",
    });
  }
};

export const validateSearch = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (e) {
    console.log(e);
    res.status(403).json({
      header: "Something went wront in the validation.",
      message: "Something went wront in the validation.",
      response: [],
      statusCode: 403,
      success: false,
      severity: "error",
    });
  }
};
