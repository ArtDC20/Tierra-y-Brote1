const { cloudinary } = require('../config/cloudinary');
const Planta = require('../models/Planta');

// Obtener todas las plantas
exports.obtenerPlantas = (req, res) => {
  Planta.obtenerTodas((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Crear planta sin imagen
exports.crearPlanta = (req, res) => {
  Planta.crear(req.body, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: '✅ Planta agregada' });
  });
};

// Crear planta con imagen
// Crear planta con imagen
exports.crearPlantaConImagen = (data, res) => {
  if (!data.imagen_url) {
    return res.status(400).json({ mensaje: '⚠️ Imagen no subida correctamente' });
  }

  Planta.crear(data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: '✅ Planta creada con imagen', planta: result });
  });
};


// Actualizar planta
// controllers/plantaController.js

exports.actualizarPlanta = (req, res) => {
  const id = req.params.id;
  const nuevaData = req.body;
  const usuario = req.usuario;  // viene de verificarToken

  Planta.obtenerPorId(id, (err, plantaActual) => {
    if (err) return res.status(500).send(err);
    if (!plantaActual) return res.status(404).json({ mensaje: 'Planta no encontrada' });

    const rol = (usuario.rol || '').toLowerCase();

    // Solo 'usuario' puede reducir stock
    if (rol === 'usuario') {
      const nuevoStock = nuevaData.stock;
      if (typeof nuevoStock === 'undefined') {
        return res.status(400).json({ mensaje: '⚠️ Debes enviar el nuevo stock' });
      }
      if (nuevoStock >= plantaActual.stock) {
        return res.status(403).json({ mensaje: '❌ No puedes aumentar el stock' });
      }
      Planta.actualizar(id, { stock: nuevoStock }, (err2) => {
        if (err2) return res.status(500).send(err2);
        return res.json({ mensaje: '✅ Stock reducido correctamente', stock: nuevoStock });
      });

    // Admin puede modificar todo
    } else if (rol === 'admin') {
      Planta.actualizar(id, nuevaData, (err2) => {
        if (err2) return res.status(500).send(err2);
        return res.json({ mensaje: '✏️ Planta actualizada correctamente' });
      });

    // Cualquier otro rol
    } else {
      return res.status(403).json({ mensaje: '❌ Rol no autorizado' });
    }
  });
};


// Eliminar planta
exports.eliminarPlanta = (req, res) => {
  const id = req.params.id;
  Planta.eliminar(id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: '🗑️ Planta eliminada' });
  });
};
