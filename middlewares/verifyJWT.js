import jwt from "jsonwebtoken";
import dotnev from "dotenv";

dotnev.config();
// Middleware para verificar el token JWT
export const verifyJWT = (req, res, next) => {
  // Asumiendo que el token viene en el encabezado de autorización como 'Bearer <token>'
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({
      header: "No token provided.",
      message: "A token is required for authentication",
      statusCode: 401,
      success: false,
      severity: "error",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_VALID_VALUE, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({
        header: "The token is invalid.",
        message: "The token is not valid",
        statusCode: 403,
        success: false,
        severity: "error",
      });
    }

    req.user = user; // Agrega la información del usuario al objeto de solicitud
    next(); // Pasa al siguiente middleware o controlador
  });
};
