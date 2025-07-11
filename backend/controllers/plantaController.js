const Planta = require('../models/Planta');
const { cloudinary } = require('../config/cloudinary');

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
  if (!data.imagen_url) {
    return res.status(400).json({ mensaje: '⚠️ Imagen no subida correctamente' });
  }

  Planta.crear(data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: '✅ Planta creada con imagen', planta: result });
  });
};

// Actualizar planta (con opción de cambiar imagen)
exports.actualizarPlanta = (req, res) => {
  const id = req.params.id;
  const nuevaData = req.body;
  const usuario = req.usuario;

  Planta.obtenerPorId(id, async (err, plantaActual) => {
    if (err) return res.status(500).send(err);
    if (!plantaActual) return res.status(404).json({ mensaje: 'Planta no encontrada' });

    const rol = (usuario.rol || '').toLowerCase();

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

    } else if (rol === 'admin') {
      try {
        // Si viene una nueva imagen
        if (req.file && req.file.path) {
          nuevaData.imagen_url = req.file.path;

          // Si hay imagen anterior de Cloudinary, intenta borrarla
          const publicId = plantaActual.imagen_url?.split('/').pop().split('.')[0];
          if (plantaActual.imagen_url?.includes('res.cloudinary.com')) {
            await cloudinary.uploader.destroy(`plantas/${publicId}`);
          }
        }

        Planta.actualizar(id, nuevaData, (err2) => {
          if (err2) return res.status(500).send(err2);
          return res.json({ mensaje: '✏️ Planta actualizada correctamente' });
        });

      } catch (err) {
        console.error('❌ Error al actualizar imagen:', err);
        return res.status(500).json({ mensaje: '❌ Error al actualizar imagen' });
      }

    } else {
      return res.status(403).json({ mensaje: '❌ Rol no autorizado' });
    }
  });
};

// Eliminar planta
exports.eliminarPlanta = (req, res) => {
  const id = req.params.id;

  Planta.obtenerPorId(id, async (err, planta) => {
    if (err) return res.status(500).send(err);
    if (!planta) return res.status(404).json({ mensaje: 'Planta no encontrada' });

    // Eliminar imagen de Cloudinary si existe
    if (planta.imagen_url?.includes('res.cloudinary.com')) {
      const publicId = planta.imagen_url.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`plantas/${publicId}`);
      } catch (err) {
        console.warn('⚠️ No se pudo eliminar imagen de Cloudinary:', err.message);
      }
    }

    Planta.eliminar(id, (err2) => {
      if (err2) return res.status(500).send(err2);
      res.json({ mensaje: '🗑️ Planta eliminada' });
    });
  });
};
