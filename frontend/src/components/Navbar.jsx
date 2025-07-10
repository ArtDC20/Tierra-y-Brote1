import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario')));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUsuario(JSON.parse(localStorage.getItem('usuario')));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setUsuario(JSON.parse(localStorage.getItem('usuario')));
  }, [location]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    alert("👋 Sesión cerrada");
    setUsuario(null);
    navigate('/');
  };

  return (
    <div className="navbar" style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#2e7d32', padding: '10px 20px', color: 'white' }}>
      <img 
        src="/logo.jpg" 
        alt="Logo Tierra & Brotes" 
        style={{ height: '40px', cursor: 'pointer' }} 
        onClick={() => navigate('/')}
      />

      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🌿 Vivero</Link>

      {usuario && (
        <>
          <Link to="/carrito" style={{ color: 'white', textDecoration: 'none' }}>🛒 Carrito</Link>
          <Link to="/checkout" style={{ color: 'white', textDecoration: 'none' }}>💳 Checkout</Link>
        </>
      )}

      {usuario?.rol === 'admin' && (
        <>
          <Link to="/agregar" style={{ color: 'white', textDecoration: 'none' }}>➕ Agregar</Link>
          <Link to="/compras-admin" style={{ color: 'white', textDecoration: 'none' }}>📋 Compras</Link> {/* ✅ Nueva opción */}
        </>
      )}

      {!usuario && location.pathname !== '/login' && (
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>🔐 Login</Link>
      )}

      {usuario && (
        <>
          <span style={{ color: '#fff', marginLeft: 'auto' }}>
            👤 {usuario.nombre} ({usuario.rol})
          </span>
          <button onClick={logout} style={{
            marginLeft: '15px',
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            🚪 Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Navbar;
