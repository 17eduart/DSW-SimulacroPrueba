import mongoose from "mongoose";
import bcrypt from "bcrypt";

const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    cedula: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10}$/
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    rol: {
      type: String,
      enum: ["cliente", "administrador"],
      default: "cliente"
    }
  },
  {
    timestamps: true
  }
);

// Hash de la contraseña antes de guardar
clienteSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});

// Comparar contraseña en el login
clienteSchema.methods.compararPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;
