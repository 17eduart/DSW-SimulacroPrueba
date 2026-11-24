import Cliente from "../models/Cliente.js";
import generarToken from "../utils/generarToken.js";

// Requisito 2: registro
const registrarCliente = async (req, res) => {
  try {
    const { nombre, cedula, correo, password } = req.body;

    if (!nombre || !cedula || !correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    const existeCliente = await Cliente.findOne({
      correo: correo.trim().toLowerCase()
    });

    if (existeCliente) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado"
      });
    }

    const cliente = await Cliente.create({
      nombre,
      cedula,
      correo,
      password,
      rol: "cliente"
    });

    res.status(201).json({
      mensaje: "Cliente registrado correctamente",
      cliente: {
        id: cliente._id,
        nombre: cliente.nombre,
        cedula: cliente.cedula,
        correo: cliente.correo,
        rol: cliente.rol
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: error.message
      });
    }

    res.status(500).json({
      mensaje: "Error al registrar cliente"
    });
  }
};

// Requisito 3: inicio de sesión
const iniciarSesion = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (
      typeof correo !== "string" ||
      typeof password !== "string" ||
      !correo.trim() ||
      !password
    ) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    const cliente = await Cliente.findOne({
      correo: correo.trim().toLowerCase()
    }).select("+password");

    if (!cliente) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas"
      });
    }

    const passwordCorrecto = await cliente.compararPassword(password);

    if (!passwordCorrecto) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas"
      });
    }

    const token = generarToken(cliente);

    res.status(200).json({
      mensaje: "Inicio de sesión correcto",
      token,
      cliente: {
        id: cliente._id,
        nombre: cliente.nombre,
        correo: cliente.correo,
        rol: cliente.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión"
    });
  }
};

export { registrarCliente, iniciarSesion };
