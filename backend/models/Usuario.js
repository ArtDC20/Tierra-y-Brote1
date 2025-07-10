const db = require('../config/db');

const Usuario = {
  crear: (data, callback) => {
    const sql = 'INSERT INTO usuarios SET ?';
    db.query(sql, data, callback);
  },
  buscarPorCorreo: (correo, callback) => {
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], callback);
  }
};

module.exports = Usuario;
