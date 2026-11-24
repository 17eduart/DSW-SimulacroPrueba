import Producto from "../models/Producto.js";

// Requisito 4: crear producto (ruta protegida con JWT)
const crearProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio, stock } = req.body;

    const producto = await Producto.create({
      nombre,
      categoria,
      precio,
      stock
    });

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        mensaje: error.message
      });
    }

    res.status(500).json({
      mensaje: "Error al crear producto"
    });
  }
};

// Requisito 4: listar y buscar productos (pública)
// GET /api/productos            -> todos
// GET /api/productos?nombre=pa  -> búsqueda sin distinguir mayúsculas
const listarProductos = async (req, res) => {
  try {
    const { nombre } = req.query;

    // Sin búsqueda: devolver todos
    if (nombre === undefined) {
      const productos = await Producto.find();
      return res.status(200).json(productos);
    }

    // Escapar caracteres especiales para usar el texto en una expresión regular
    const termino = String(nombre)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const productos = await Producto.find({
      nombre: { $regex: termino, $options: "i" }
    });

    if (productos.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron productos que concuerden con la búsqueda."
      });
    }

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar productos"
    });
  }
};

export { crearProducto, listarProductos };
