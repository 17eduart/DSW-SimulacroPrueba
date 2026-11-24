import jwt from "jsonwebtoken";

// Requisito 5: proteger rutas con JWT
const verificarToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token no válido o no proporcionado."
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });

    req.cliente = { id: decoded.sub, rol: decoded.rol };
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token no válido o no proporcionado."
    });
  }
};

export default verificarToken;
