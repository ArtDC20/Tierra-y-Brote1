import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await api.post('/usuarios/login', {
        correo: correo.trim(),
        contrasena: contrasena.trim()
      });

      alert(`✅ Bienvenido ${res.data.usuario.nombre}`);

      // ✅ Guardar token dentro del objeto usuario
      localStorage.setItem('usuario', JSON.stringify({
        ...res.data.usuario,
        token: res.data.token
      }));

      navigate('/');
    } catch (err) {
      console.error(err);
      alert('❌ Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h2>🔐 Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#2d7a35',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Iniciar sesión
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        ¿No tienes una cuenta?{' '}
        <Link to="/register" style={{ color: '#2d7a35', textDecoration: 'underline' }}>
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};

export default Login;
