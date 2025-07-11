require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 🔥 extrae el token sin "Bearer"

  if (!token) return res.status(403).json({ mensaje: 'Token requerido' });

  try {
    console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET); // Agrega esto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};


exports.verificarAdmin = (req, res, next) => {
  if (req.usuario.rol.toLowerCase() !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
  }
  next();
};

