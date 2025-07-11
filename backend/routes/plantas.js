const express = require('express');
const router = express.Router();
const plantaCtrl = require('../controllers/plantaController');

// Importar el nuevo middleware desde config/cloudinary.js
const { storage } = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage });

const { verificarToken, verificarAdmin } = require('../middleware/auth');

// Obtener todas las plantas
router.get('/', plantaCtrl.obtenerPlantas);

// Crear planta con imagen en Cloudinary
router.post('/', verificarToken, verificarAdmin, upload.single('imagen'), (req, res) => {
  const data = req.body;
   data.imagen_url = req.file ? req.file.path : null; // Cloudinary devuelve `path` completo
  plantaCtrl.crearPlantaConImagen(data, res);
});

// Actualizar planta
router.put('/:id', verificarToken, plantaCtrl.actualizarPlanta);

// Eliminar planta
router.delete('/:id', verificarToken, verificarAdmin, plantaCtrl.eliminarPlanta);

module.exports = router;
