const Compra = require('../models/Compra');
const db = require('../config/db');

exports.finalizarCompra = (req, res) => {
  const { cliente, productos, total } = req.body;
  const id_usuario = cliente.id; 

  Compra.crearCompra(id_usuario, total, (err, result) => {
    if (err) return res.status(500).send(err);
    const id_compra = result.insertId;

    Compra.agregarDetalle(id_compra, productos, (err2, result2) => {
      if (err2) return res.status(500).send(err2);
      res.json({ mensaje: '✅ Compra realizada exitosamente' });
    });
  });
};

// ✅ Nueva función: obtener todas las compras con detalles
exports.obtenerCompras = async (req, res) => {
  try {
    const [compras] = await db.promise().query(`
      SELECT c.id, u.nombre, u.correo, c.total, c.fecha
      FROM compras c
      JOIN usuarios u ON c.usuario_id = u.id
      ORDER BY c.fecha DESC
    `);

    const comprasConDetalles = await Promise.all(
      compras.map(async compra => {
        const [detalles] = await db.promise().query(`
          SELECT p.nombre, dc.cantidad, dc.precio_unitario, dc.subtotal
          FROM detalle_compra dc
          JOIN plantas p ON dc.planta_id = p.id
          WHERE dc.compra_id = ?
        `, [compra.id]);

        return { ...compra, detalles };
      })
    );

    res.json(comprasConDetalles);
  } catch (error) {
    console.error('❌ Error al obtener compras:', error);
    res.status(500).json({ mensaje: 'Error al obtener compras' });
  }
};
