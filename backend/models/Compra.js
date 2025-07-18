const db = require('../config/db');

const Compra = {};


Compra.crearCompra = (usuario_id, total, callback) => {
  const sql = 'INSERT INTO compras (usuario_id, total, fecha) VALUES (?, ?, NOW())';
  db.query(sql, [usuario_id, total], callback);
};


Compra.agregarDetalle = async (compra_id, productos, callback) => {
  try {
    for (const item of productos) {
      const { id: planta_id, cantidad, precio } = item;
      const subtotal = parseFloat(precio) * parseInt(cantidad);

    
      await db.query(
        'INSERT INTO detalle_compra (compra_id, planta_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [compra_id, planta_id, cantidad, precio, subtotal]
      );

 
      await db.query(
        'UPDATE plantas SET stock = stock - ? WHERE id = ?',
        [cantidad, planta_id]
      );
    }

    callback(null, { mensaje: '✅ Detalles insertados' });
  } catch (error) {
    callback(error);
  }
};

module.exports = Compra;
