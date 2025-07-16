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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    form.precio = parseFloat(form.precio).toFixed(2);

    const precioValido = /^\d+(\.\d{1,2})?$/.test(form.precio);
    if (!precioValido) {
      alert('❌ Ingresa un precio válido con punto decimal, por ejemplo: 1.50');
      return;
    }
    
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
          Authorization: `Bearer ${token}`
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
      <h2>➕ Agregar Planta</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="card">
        <input
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          required
        />
        <select name="categoria" onChange={handleChange} value={form.categoria}>
          <option value="Ornamental">Ornamental</option>
          <option value="Medicinal">Medicinal</option>
        </select>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          onChange={handleChange}
        />
        <input
          type="text"
          name="precio"
          placeholder="Precio (ej. 1.50)"
          step="0.01"
          min="0"
          inputMode="decimal"
          lang="en"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          min="0"
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default PlantForm;
