import express from "express";

import {
  registrarCliente,
  iniciarSesion
} from "../controllers/clienteController.js";

const router = express.Router();

router.post("/registro", registrarCliente);
router.post("/login", iniciarSesion);

export default router;
