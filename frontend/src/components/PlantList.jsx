import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

const PlantList = () => {
  const [plantas, setPlantas] = useState([]);
  const [categoria, setCategoria] = useState('Todas');
  const [cantidadesAgregar, setCantidadesAgregar] = useState({});
  const [cantidadesReducir, setCantidadesReducir] = useState({});
  const { addToCart } = useContext(CartContext);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const rol = usuario?.rol || '';
  const token = usuario?.token || '';
  const baseURL = 'https://tierra-y-brote-production.up.railway.app';

  useEffect(() => {
    const fetchPlantas = async () => {
      try {
        const res = await api.get('/plantas');
        setPlantas(res.data);
      } catch (error) {
        console.error('Error al obtener plantas:', error);
      }
    };
    fetchPlantas();
  }, []);

  const handleAgregarChange = (id, value) => {
    setCantidadesAgregar({ ...cantidadesAgregar, [id]: value });
  };

  const handleReducirChange = (id, value) => {
    setCantidadesReducir({ ...cantidadesReducir, [id]: value });
  };

  const agregarAlCarrito = async (planta) => {
    const cantidad = parseInt(cantidadesAgregar[planta.id] || 1);
    if (isNaN(cantidad) || cantidad <= 0) return alert('⚠️ Ingresa una cantidad válida');
    if (cantidad > planta.stock) return alert('⚠️ Stock insuficiente');

    const nuevoStock = planta.stock - cantidad;

    try {
      await api.put(
        /plantas/${planta.id},
        { ...planta, stock: nuevoStock },
        {
          headers: {
            Authorization: Bearer ${token}
          }
        }
      );
      addToCart(planta, cantidad);
      setPlantas(plantas.map(p => p.id === planta.id ? { ...p, stock: nuevoStock } : p));
      setCantidadesAgregar({ ...cantidadesAgregar, [planta.id]: '' });
    } catch (error) {
      alert('❌ Error al actualizar stock y agregar al carrito');
      console.error(error);
    }
  };

  const reducirStock = async (planta) => {
    const cantidad = parseInt(cantidadesReducir[planta.id] || 1);
    if (isNaN(cantidad) || cantidad <= 0) return alert('⚠️ Ingresa una cantidad válida');
    if (cantidad > planta.stock) return alert('⚠️ Stock insuficiente para reducir');

    const nuevoStock = planta.stock - cantidad;

    try {
      await api.put(
        /plantas/${planta.id},
        { ...planta, stock: nuevoStock },
        {
          headers: {
            Authorization: Bearer ${token}
          }
        }
      );
      alert(✅ Stock reducido en ${cantidad} unidades);
      setPlantas(plantas.map(p => p.id === planta.id ? { ...p, stock: nuevoStock } : p));
      setCantidadesReducir({ ...cantidadesReducir, [planta.id]: '' });
    } catch (error) {
      alert('❌ Error al reducir el stock');
      console.error(error);
    }
  };

  const eliminarPlanta = async (id) => {
    if (window.confirm('¿Deseas eliminar esta planta?')) {
      try {
        await api.delete(/plantas/${id}, {
          headers: {
            Authorization: Bearer ${token}
          }
        });
        alert('🗑️ Planta eliminada');
        setPlantas(plantas.filter(p => p.id !== id));
      } catch (error) {
        alert('❌ Error al eliminar planta');
        console.error(error);
      }
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
        <div key={planta.id} className="card" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          padding: '20px'
        }}>
          <div style={{ flex: 1 }}>
            <h4>{planta.nombre}</h4>
            <p><strong>Categoría:</strong> {planta.categoria}</p>
            <p>{planta.descripcion}</p>
            <p>💲 <strong>{parseFloat(planta.precio).toFixed(2)}</strong> | Stock: {planta.stock}</p>

            <div className="acciones-stock">
              {rol === 'usuario' && (
                <>
                  <input
                    type="number"
                    min="1"
                    placeholder="Cantidad"
                    className="input-cantidad"
                    value={cantidadesAgregar[planta.id] || ''}
                    onChange={e => handleAgregarChange(planta.id, e.target.value)}
                  />
                  <button className="btn btn-agregar" onClick={() => agregarAlCarrito(planta)}>
                    🛒 Agregar
                  </button>
                </>
              )}

              {rol === 'admin' && (
                <>
                  <input
                    type="number"
                    min="1"
                    placeholder="Cantidad"
                    className="input-cantidad"
                    value={cantidadesReducir[planta.id] || ''}
                    onChange={e => handleReducirChange(planta.id, e.target.value)}
                  />
                  <button className="btn btn-reducir" onClick={() => reducirStock(planta)}>
                    ➖ Reducir
                  </button>

                  <button className="btn btn-eliminar" onClick={() => eliminarPlanta(planta.id)}>
                    🗑️ Eliminar
                  </button>
                </>
              )}
            </div>
          </div>

          {planta.imagen_url && (
            <img
              src={${baseURL}/uploads/${planta.imagen_url}}
              alt={planta.nombre}
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PlantList;
