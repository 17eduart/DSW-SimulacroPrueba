import express from "express";

import {
  crearProducto,
  listarProductos
} from "../controllers/productoController.js";
import verificarToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", listarProductos);
router.post("/", verificarToken, crearProducto);

export default router;
