const { cloudinary } = require('../config/cloudinary');
const Planta = require('../models/Planta');

exports.obtenerPlantas = (req, res) => {
  Planta.obtenerTodas((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.crearPlanta = (req, res) => {
  Planta.crear(req.body, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: '✅ Planta agregada' });
  });
};


exports.crearPlantaConImagen = (data, res) => {
  if (!data.imagen_url) {
    return res.status(400).json({ mensaje: '⚠️ Imagen no subida correctamente' });
  }

  Planta.crear(data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: '✅ Planta creada con imagen', planta: result });
  });
};



exports.actualizarPlanta = (req, res) => {
  const id = req.params.id;
  const nuevaData = req.body;
  const usuario = req.usuario;  

  Planta.obtenerPorId(id, (err, plantaActual) => {
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
      Planta.actualizar(id, nuevaData, (err2) => {
        if (err2) return res.status(500).send(err2);
        return res.json({ mensaje: '✏️ Planta actualizada correctamente' });
      });

 
    } else {
      return res.status(403).json({ mensaje: '❌ Rol no autorizado' });
    }
  });
};



exports.eliminarPlanta = (req, res) => {
  const id = req.params.id;
  Planta.eliminar(id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: '🗑️ Planta eliminada' });
  });
};
