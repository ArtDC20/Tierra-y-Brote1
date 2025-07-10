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
exports.crearPlantaConImagen = (data, res) => {
  Planta.crear(data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: '✅ Planta creada con imagen' });
  });
};

// Actualizar planta
exports.actualizarPlanta = (req, res) => {
  const id = req.params.id;
  const nuevaData = req.body;
  const usuario = req.usuario;

  // Verificamos si existe la planta
  Planta.obtenerPorId(id, (err, plantaActual) => {
    if (err) return res.status(500).send(err);
    if (!plantaActual) return res.status(404).json({ mensaje: 'Planta no encontrada' });

    const rol = usuario.rol.toLowerCase(); // ⚠️ Normaliza a minúscula

    if (rol === 'cliente') {
      const nuevoStock = nuevaData.stock;

      if (typeof nuevoStock === 'undefined') {
        return res.status(400).json({ mensaje: '⚠️ Debes enviar el nuevo stock' });
      }

      if (nuevoStock >= plantaActual.stock) {
        return res.status(403).json({ mensaje: '❌ No tienes permiso para aumentar el stock' });
      }

      Planta.actualizar(id, { stock: nuevoStock }, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: '✅ Stock reducido correctamente' });
      });

    } else if (rol === 'admin') {
      Planta.actualizar(id, nuevaData, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: '✏️ Planta actualizada correctamente' });
      });
    } else {
      res.status(403).json({ mensaje: '❌ Rol no autorizado' });
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
