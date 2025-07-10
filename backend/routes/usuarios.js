const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');

router.post('/register', usuarioCtrl.registrar);
router.post('/login', usuarioCtrl.login);

module.exports = router;
