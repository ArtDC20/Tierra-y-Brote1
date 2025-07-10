import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || !usuario.token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RutaPrivada;
