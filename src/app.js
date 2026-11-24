import express from "express";
import cors from "cors";

import clienteRoutes from "./routes/clienteRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Requisito 1: Bienvenida (pública)
app.get("/", (req, res) => {
  res.status(200).json({
    nombre: "Bienvenido a Fybeca",
    detalle: "Tu salud, nuestra prioridad"
  });
});

app.use("/api/clientes", clienteRoutes);
app.use("/api/productos", productoRoutes);

// Cualquier otra ruta
app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada"
  });
});

export default app;
