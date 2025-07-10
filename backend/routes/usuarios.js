const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');

router.post('/register', usuarioCtrl.registrar);
router.post('/login', usuarioCtrl.login);
router.get('/ping', (req, res) => {
  console.log("🔁 Ping recibido");
  res.send('✅ Backend responde correctamente');
});


module.exports = router;
