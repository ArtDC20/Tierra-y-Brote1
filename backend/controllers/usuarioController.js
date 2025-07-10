const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Registro de usuario
exports.registrar = (req, res) => {
  const data = req.body;

  data.rol = data.tipo;
  delete data.tipo;

  data.contrasena = bcrypt.hashSync(data.contrasena, 10); 

  Usuario.crear(data, (err, result) => {
    if (err) {
      console.error("❌ Error en Usuario.crear:", err.sqlMessage || err);
      return res.status(500).json({ error: err.sqlMessage || 'Error en el servidor' });
    }
    res.json({ mensaje: '✅ Usuario registrado', result });
  });
};


// ✅ Inicio de sesión y respuesta con datos completos
exports.login = (req, res) => {
  const { correo, contrasena } = req.body; 

  Usuario.buscarPorCorreo(correo, (err, results) => {
    if (err || results.length === 0) return res.status(401).send('Usuario no encontrado');

    const user = results[0];
    const match = bcrypt.compareSync(contrasena, user.contrasena); 
    if (!match) return res.status(401).send('Contraseña incorrecta');

    // Token de autenticación
    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
      'secreto',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
        correo: user.correo,
        direccion: user.direccion,
        telefono: user.telefono
      }
    });
  });
};
