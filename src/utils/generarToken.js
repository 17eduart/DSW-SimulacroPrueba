import jwt from "jsonwebtoken";

const generarToken = (cliente) => {
  return jwt.sign(
    {
      rol: cliente.rol
    },
    process.env.JWT_SECRET,
    {
      subject: cliente._id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      algorithm: "HS256"
    }
  );
};

export default generarToken;
