import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ComprasAdmin = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/compras', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompras(res.data);
      } catch (err) {
        console.error('❌ Error al obtener compras:', err);
      }
    };

    fetchCompras();
  }, []);

  return (
    <div className="container">
      <h2>📦 Historial de Compras</h2>
      {compras.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        compras.map((compra, index) => (
          <div key={index} style={{ border: '1px solid #ccc', marginBottom: 20, padding: 15 }}>
            <h4>🧾 Compra #{compra.id} - {new Date(compra.fecha).toLocaleDateString()}</h4>
            <p><strong>Cliente:</strong> {compra.usuario_nombre}</p>
            <p><strong>Total:</strong> ${parseFloat(compra.total).toFixed(2)}</p>
            <h5>🪴 Productos:</h5>
            <ul>
              {compra.detalles.map((det, idx) => (
                <li key={idx}>
                  {det.nombre} - {det.cantidad} x ${parseFloat(det.precio_unitario).toFixed(2)} = ${parseFloat(det.subtotal).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ComprasAdmin;
