require('dotenv').config();

console.log("🟢 Index.js cargado correctamente");

const express = require('express');
const cors = require('cors');
const app = express();

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

// Servir imágenes desde /uploads
app.use('/uploads', express.static('uploads'));

console.log("🕓 A punto de iniciar el servidor...");

cconst PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend corriendo en el puerto ${PORT}`);
});



