const express = require('express');
const router = express.Router();
const plantaCtrl = require('../controllers/plantaController');
const upload = require('../middleware/upload');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

router.get('/', plantaCtrl.obtenerPlantas);

router.post('/', verificarToken, verificarAdmin, upload.single('imagen'), (req, res) => {
  const data = req.body;
  data.imagen_url = req.file ? req.file.filename : null;
  plantaCtrl.crearPlantaConImagen(data, res);
});

router.put('/:id', verificarToken, plantaCtrl.actualizarPlanta); // 🔧 Línea corregida

router.delete('/:id', verificarToken, verificarAdmin, plantaCtrl.eliminarPlanta);

module.exports = router;
