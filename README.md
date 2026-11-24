# Simulacro Fybeca – Solución

> Intenta resolver primero el enunciado (`../Simulacro-Fybeca-Enunciado.docx`) en 1:30 h sin mirar esta carpeta.

## Ejecutar

```bash
npm install
npm run dev
```

Requiere MongoDB en `127.0.0.1:27017`. Si no existe `.env`, copia `.env.example` como `.env` y genera un `JWT_SECRET`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

La base `fybeca` y sus colecciones (`clientes`, `productos`) se crean solas al registrar el primer cliente / producto.

## Estructura

```
Solucion/
├── server.js                         Conecta MongoDB e inicia el servidor
├── .env / .env.example
└── src/
    ├── app.js                        Express, rutas, bienvenida y 404
    ├── config/database.js            conectarBD()
    ├── models/Cliente.js             Schema + bcrypt + compararPassword
    ├── models/Producto.js            Schema con enum y min
    ├── utils/generarToken.js         jwt.sign
    ├── middlewares/authMiddleware.js verificarToken (Bearer)
    ├── controllers/clienteController.js   registrarCliente, iniciarSesion
    ├── controllers/productoController.js  crearProducto, listarProductos
    ├── routes/clienteRoutes.js
    └── routes/productoRoutes.js
```

## Pruebas

Importa `Fybeca.postman_collection.json` en Postman (Import → archivo) y ejecútalas **en orden**. El login guarda el token automáticamente en `{{token}}`.

| # | Petición | Esperado |
|---|---|---|
| 01 | `GET /` | 200 bienvenida |
| 02 | `POST /api/clientes/registro` | 201 `Cliente registrado correctamente` |
| 03 | mismo correo (en mayúsculas) | 409 `El correo ya está registrado` |
| 04 | faltan campos | 400 `Todos los campos son obligatorios` |
| 05 | `POST /api/clientes/login` | 200 + `token` |
| 06 | contraseña incorrecta | 401 `Credenciales incorrectas` |
| 07 | `POST /api/productos` sin token | 401 `Acceso denegado. Token no válido o no proporcionado.` |
| 08–09 | `POST /api/productos` con token | 201 `Producto creado correctamente` |
| 10 | categoría/precio inválidos | 400 (ValidationError) |
| 11 | `GET /api/productos` | 200 lista |
| 12 | `GET /api/productos?nombre=PARA` | 200 encuentra "Paracetamol" |
| 13 | `GET /api/productos?nombre=vitamina` | 404 `No se encontraron productos que concuerden con la búsqueda.` |

## Puntos clave que suelen evaluarse

- `"type": "module"` en `package.json` y `import "dotenv/config"` como primera línea de `server.js`.
- `select: false` en `password` → en el login hay que usar `.select("+password")`.
- El hash va en `pre("save")` (no se ejecuta con `findByIdAndUpdate`).
- `unique` no es un validador: crea un índice; el duplicado llega como `error.code === 11000`.
- Búsqueda sin distinguir mayúsculas: `{ nombre: { $regex: termino, $options: "i" } }`.
- `find()` devuelve `[]` (no `null`) cuando no hay resultados → comprobar `productos.length === 0`.
- 401 = no autenticado (sin token / token malo); 403 = autenticado pero sin permiso.
- El middleware va **antes** del controlador: `router.post("/", verificarToken, crearProducto)`.
