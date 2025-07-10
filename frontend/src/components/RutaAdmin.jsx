import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaAdmin = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || !usuario.rol) {
    return <Navigate to="/login" />;
  }

  return usuario.rol === 'admin' ? children : <Navigate to="/" />;
};

export default RutaAdmin;
