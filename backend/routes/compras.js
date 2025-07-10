const express = require('express');
const router = express.Router();
const compraCtrl = require('../controllers/compraController');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

// Ruta para finalizar la compra
router.post('/', compraCtrl.finalizarCompra);

// Nueva ruta para obtener todas las compras (solo admin)
router.get('/', verificarToken, verificarAdmin, compraCtrl.obtenerCompras);

module.exports = router;
