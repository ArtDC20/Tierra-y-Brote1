const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registrar = (req, res) => {
  console.log("📥 Recibido en /register:", req.body);

  try {
    const data = req.body;


    if (!data.rol) data.rol = 'usuario';

    data.contrasena = bcrypt.hashSync(data.contrasena, 10);

    Usuario.crear(data, (err, result) => {
      if (err) {
        console.error("❌ Error SQL:", err.sqlMessage || err);
        return res.status(500).json({ error: err.sqlMessage || err });
      }
      console.log("✅ Usuario insertado:", result);
      res.json({ mensaje: 'Usuario registrado correctamente', result });
    });

  } catch (e) {
    console.error("❌ Error inesperado:", e.message);
    res.status(500).send('Error interno');
  }
};





exports.login = (req, res) => {
  const { correo, contrasena } = req.body; 

  Usuario.buscarPorCorreo(correo, (err, results) => {
    if (err || results.length === 0) return res.status(401).send('Usuario no encontrado');

    const user = results[0];
    const match = bcrypt.compareSync(contrasena, user.contrasena); 
    if (!match) return res.status(401).send('Contraseña incorrecta');


    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
       process.env.JWT_SECRET,
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
