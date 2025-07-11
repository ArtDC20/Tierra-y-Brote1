import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import EditPlantForm from './EditPlantForm';

const PlantList = () => {
  const [plantas, setPlantas] = useState([]);
  const [categoria, setCategoria] = useState('Todas');
  const [cantidadesAgregar, setCantidadesAgregar] = useState({});
  const [cantidadesReducir, setCantidadesReducir] = useState({});
  const [plantaEditando, setPlantaEditando] = useState(null);

  const { addToCart } = useContext(CartContext);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const rol = usuario?.rol || '';
  const token = usuario?.token || '';

  useEffect(() => {
    fetchPlantas();
  }, []);

  const fetchPlantas = async () => {
    try {
      const res = await api.get('/plantas');
      setPlantas(res.data);
    } catch (error) {
      console.error('Error al obtener plantas:', error);
    }
  };

  const handleAgregarChange = (id, value) => {
    setCantidadesAgregar({ ...cantidadesAgregar, [id]: value });
  };

  const handleReducirChange = (id, value) => {
    setCantidadesReducir({ ...cantidadesReducir, [id]: value });
  };

  const agregarAlCarrito = async (planta) => {
    const cantidad = parseInt(cantidadesAgregar[planta.id] || 1);
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > planta.stock) return;

    const nuevoStock = planta.stock - cantidad;

    try {
      await api.put(`/plantas/${planta.id}`, { ...planta, stock: nuevoStock }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToCart(planta, cantidad);
      fetchPlantas();
    } catch (error) {
      console.error(error);
    }
  };

  const reducirStock = async (planta) => {
    const cantidad = parseInt(cantidadesReducir[planta.id] || 1);
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > planta.stock) return;

    const nuevoStock = planta.stock - cantidad;

    try {
      await api.put(`/plantas/${planta.id}`, { ...planta, stock: nuevoStock }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPlantas();
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarPlanta = async (id) => {
    if (!window.confirm('¿Eliminar esta planta?')) return;

    try {
      await api.delete(`/plantas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPlantas();
    } catch (error) {
      console.error(error);
    }
  };

  const plantasFiltradas = categoria === 'Todas'
    ? plantas
    : plantas.filter(p => p.categoria === categoria);

  return (
    <div className="container">
      <h2>🌿 Plantas Disponibles</h2>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={() => setCategoria('Todas')}>Todas</button>{' '}
        <button onClick={() => setCategoria('Ornamental')}>Ornamentales</button>{' '}
        <button onClick={() => setCategoria('Medicinal')}>Medicinales</button>
      </div>

      {plantasFiltradas.map(planta => (
        <div key={planta.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ flex: 1 }}>
            <h4>{planta.nombre}</h4>
            <p><strong>Categoría:</strong> {planta.categoria}</p>
            <p>{planta.descripcion}</p>
            <p>💲 <strong>{parseFloat(planta.precio).toFixed(2)}</strong> | Stock: {planta.stock}</p>

            <div className="acciones-stock">
              {rol === 'usuario' && (
                <>
                  <input type="number" min="1" placeholder="Cantidad" className="input-cantidad"
                    value={cantidadesAgregar[planta.id] || ''}
                    onChange={e => handleAgregarChange(planta.id, e.target.value)} />
                  <button onClick={() => agregarAlCarrito(planta)}>🛒 Agregar</button>
                </>
              )}

              {rol === 'admin' && (
                <>
                  <input type="number" min="1" placeholder="Cantidad" className="input-cantidad"
                    value={cantidadesReducir[planta.id] || ''}
                    onChange={e => handleReducirChange(planta.id, e.target.value)} />
                  <button onClick={() => reducirStock(planta)}>➖ Reducir</button>
                  <button onClick={() => eliminarPlanta(planta.id)}>🗑️ Eliminar</button>
                  <button onClick={() => setPlantaEditando(planta)}>✏️ Editar</button>
                </>
              )}
            </div>
          </div>

          {planta.imagen_url && (
            <img src={planta.imagen_url} alt={planta.nombre} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
          )}
        </div>
      ))}

      {plantaEditando && (
        <EditPlantForm
          planta={plantaEditando}
          onCancel={() => setPlantaEditando(null)}
          onSuccess={fetchPlantas}
        />
      )}
    </div>
  );
};

export default PlantList;
