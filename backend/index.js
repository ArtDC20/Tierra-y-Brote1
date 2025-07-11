require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // 👈 necesario para rutas absolutas
const app = express();

console.log("🟢 Index.js cargado correctamente");

// Importación de rutas
const usuarios = require('./routes/usuarios');
const plantasRoutes = require('./routes/plantas');
const comprasRoutes = require('./routes/compras');

app.use(cors());
app.use(express.json());

// Uso de rutas
app.use('/api/usuarios', usuarios);
app.use('/api/plantas', plantasRoutes);
app.use('/api/compras', comprasRoutes);

// 🔥 Servir imágenes desde /uploads (ruta absoluta)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log("🕓 A punto de iniciar el servidor...");

const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend corriendo en el puerto ${PORT}`);
});
