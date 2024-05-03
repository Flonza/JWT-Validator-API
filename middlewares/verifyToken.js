//Authorization: Bearer <token>
export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined" && bearerHeader !== null) {
    const t = bearerHeader.split(" ")[1];
    req.token = t;
    next();
  } else {
    res.status(401).json({
      header: "You are not authorized to use this resource.",
      message: "You do not have permissions to perform these actions.",
      statusCode: 401,
      success: false,
      severity: "error",
    });
  }
};
