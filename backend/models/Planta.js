const db = require('../config/db');

const Planta = {
  obtenerTodas: callback => {
    db.query('SELECT * FROM plantas', callback);
  },

  obtenerPorId: (id, callback) => {
    db.query('SELECT * FROM plantas WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]); // Devuelve solo un resultado
    });
  },

  crear: (data, callback) => {
    const sql = 'INSERT INTO plantas SET ?';
    db.query(sql, data, callback);
  },

  actualizar: (id, data, callback) => {
    const sql = 'UPDATE plantas SET ? WHERE id = ?';
    db.query(sql, [data, id], callback);
  },

  eliminar: (id, callback) => {
    db.query('DELETE FROM plantas WHERE id = ?', [id], callback);
  }
};

module.exports = Planta;
