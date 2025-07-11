import React, { useState } from 'react';
import api from '../services/api';

const PlantForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    categoria: 'Ornamental',
    descripcion: '',
    precio: '',
    stock: ''
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

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
    }

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const token = usuario?.token;
      await api.post('/plantas', formData, {
        headers: {
          Authorization: Bearer ${token}
        }
      });
      alert('✅ Planta agregada correctamente');
    } catch (err) {
      console.error(err);
      alert('❌ Error al agregar planta');
    }
  };

  return (
    <div className="container">
      <h2>🌱 Agregar Planta</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="card">
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        
        <select name="categoria" onChange={handleChange} value={form.categoria}>
          <option value="Ornamental">Ornamental</option>
          <option value="Medicinal">Medicinal</option>
        </select>

        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} />
        <input type="number" name="precio" placeholder="Precio" onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock disponible" onChange={handleChange} required />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img src={preview} alt="Vista previa" style={{ width: '200px', marginTop: '10px', borderRadius: '8px' }} />
        )}

        <button type="submit">➕ Agregar planta</button>
      </form>
    </div>
  );
};

export default PlantForm;
