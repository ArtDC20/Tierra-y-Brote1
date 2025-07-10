import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, total } = useContext(CartContext);
  const [cantidades, setCantidades] = useState({});

  const handleCantidadChange = (id, value) => {
    setCantidades({ ...cantidades, [id]: value });
  };

  const eliminarCantidad = (id) => {
    const cantidad = parseInt(cantidades[id] || 1);
    if (isNaN(cantidad) || cantidad <= 0) {
      alert('⚠️ Ingresa una cantidad válida mayor a 0');
      return;
    }
    removeFromCart(id, cantidad);
    setCantidades({ ...cantidades, [id]: '' });
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🛒 <strong>Carrito de Compras</strong>
      </h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: 'center' }}>🪴 No hay productos en el carrito.</p>
      ) : (
        <div className="cart-grid">
          {cart.map((item, index) => (
            <div key={index} className="cart-card" style={styles.card}>
              {item.imagen && (
                <img
                  src={`http://localhost:4000/uploads/${item.imagen}`}
                  alt={item.nombre}
                  style={styles.image}
                />
              )}
              <div style={styles.info}>
                <h4>{item.nombre}</h4>
                <p>💲 {Number(item.precio).toFixed(2)} x {item.cantidad}</p>
                <p><strong>Subtotal:</strong> ${(Number(item.precio) * item.cantidad).toFixed(2)}</p>
                <div style={styles.actions}>
                  <input
                    type="number"
                    min="1"
                    placeholder="Cantidad"
                    value={cantidades[item.id] || ''}
                    onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                    style={styles.input}
                  />
                  <button
                    onClick={() => eliminarCantidad(item.id)}
                    style={styles.button}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ textAlign: 'center', marginTop: '40px' }}>
        Total a pagar: <span style={{ color: 'green' }}>${total().toFixed(2)}</span>
      </h3>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  image: {
    width: '120px',
    height: 'auto',
    borderRadius: '8px',
  },
  info: {
    flex: 1,
  },
  actions: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  input: {
    padding: '5px',
    width: '80px',
  },
  button: {
    backgroundColor: '#d9534f',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Cart;
