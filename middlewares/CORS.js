const ACCESS_ORIGIN = [
  "http://localhost:4200",
  "http://localhost:3000",
  "http://web-random",
  "https://web-random",
  undefined,
  null,
];

export const CORS = (req, res, next) => {
  const origin = req.header("origin");
  if (ACCESS_ORIGIN.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Credentials", "true"); // Permitir credenciales
  } else {
    res.status(403).send("Origin not allowed " + origin);
    return;
  }

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  next();
};

// Existen metodos simples y metodos complejos (Put patch o delete) que usan CORS-flight, requieren una maricada
// Que es enviada por medio del VERBO o METODO Options
// Es mejor segun lo que tengo entendido anhadir las cosas del CORS en un middleware para que asi en cada peticion
// sea agregado en vez de esperar hasta cierto punto xd. Por eso el middleware del CORS

// Algo que genera muchos problemas es el CORS que enrealidad se soluciona por medio de una simple cabecera de
// En la declaracion del endpoint
