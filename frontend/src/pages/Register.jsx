import React, { useState } from 'react';
import api from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',  // ✅ sin ñ
    direccion: '',
    telefono: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post('/usuarios/register', form);
    alert('✅ Usuario registrado');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
      <input name="correo" placeholder="Correo" type="email" onChange={handleChange} required />
      <input name="contrasena" placeholder="Contraseña" type="password" onChange={handleChange} required />
      <input name="direccion" placeholder="Dirección" onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;
