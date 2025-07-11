const express = require('express');
const router = express.Router();
const compraCtrl = require('../controllers/compraController');
const { verificarToken, verificarAdmin } = require('../middleware/auth');


router.post('/', compraCtrl.finalizarCompra);


router.get('/', verificarToken, verificarAdmin, compraCtrl.obtenerCompras);

module.exports = router;
