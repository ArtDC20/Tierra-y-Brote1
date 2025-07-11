import React, { useState } from 'react';
import api from '../services/api';

const EditPlantForm = ({ planta, onCancel, onSuccess }) => {
  const [form, setForm] = useState({
    nombre: planta.nombre,
    categoria: planta.categoria,
    descripcion: planta.descripcion,
    precio: planta.precio,
    stock: planta.stock
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(planta.imagen_url);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (imagen) {
      formData.append('imagen', imagen);
      formData.append('imagenActual', planta.imagen_url); // Para eliminar en Cloudinary
    }

    try {
      const token = localStorage.getItem('token');
      await api.put(`/plantas/${planta.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('✅ Planta actualizada');
      onUpdated(); // Refrescar la lista
    } catch (err) {
      console.error(err);
      alert('❌ Error al actualizar planta');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="card">
      <input name="nombre" value={form.nombre} onChange={handleChange} required />
      <select name="categoria" value={form.categoria} onChange={handleChange}>
        <option value="Ornamental">Ornamental</option>
        <option value="Medicinal">Medicinal</option>
      </select>
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
      <input type="number" name="precio" value={form.precio} onChange={handleChange} required />
      <input type="number" name="stock" value={form.stock} onChange={handleChange} required />

      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <img src={preview} alt="Vista previa" style={{ width: '150px', marginTop: '10px', borderRadius: '8px' }} />
      )}

      <div style={{ marginTop: '10px' }}>
        <button type="submit">💾 Guardar</button>{' '}
        <button type="button" onClick={onCancel}>❌ Cancelar</button>
      </div>
    </form>
  );
};

export default EditPlantForm;
