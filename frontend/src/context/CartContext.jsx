import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userId = usuario?.id;
  const localKey = `carrito_${userId}`;

  const [cart, setCart] = useState(() => {
    const guardado = localStorage.getItem(localKey);
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem(localKey, JSON.stringify(cart));
    }
  }, [cart, userId]);

  // ✅ Agregar cantidad específica
  const addToCart = (planta, cantidad = 1) => {
    const cantidadNum = parseInt(cantidad);
    if (!cantidadNum || cantidadNum <= 0) return;

    const existe = cart.find(p => p.id === planta.id);
    if (existe) {
      setCart(cart.map(p =>
        p.id === planta.id
          ? { ...p, cantidad: p.cantidad + cantidadNum }
          : p
      ));
    } else {
      setCart([...cart, { ...planta, cantidad: cantidadNum }]);
    }
  };

  // ✅ Eliminar cantidad específica
  const removeFromCart = (id, cantidad = 1) => {
    setCart(prevCart =>
      prevCart.reduce((nuevoCarrito, item) => {
        if (item.id === id) {
          if (item.cantidad > cantidad) {
            nuevoCarrito.push({ ...item, cantidad: item.cantidad - cantidad });
          }
          // Si es igual o menor, no se agrega (se elimina completamente)
        } else {
          nuevoCarrito.push(item);
        }
        return nuevoCarrito;
      }, [])
    );
  };

  const clearCart = () => setCart([]);

  const total = () =>
    cart.reduce((acc, p) => acc + Number(p.precio) * p.cantidad, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
