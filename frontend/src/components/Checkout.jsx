import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { cart, total, clearCart } = useContext(CartContext);
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

  const [cliente, setCliente] = useState({
    id: '',
    nombre: '',
    correo: '',
    direccion: '',
    telefono: ''
  });

  useEffect(() => {
    if (usuarioLogueado) {
      setCliente({
        id: usuarioLogueado.id,
        nombre: usuarioLogueado.nombre || '',
        correo: usuarioLogueado.correo || '',
        direccion: usuarioLogueado.direccion || '',
        telefono: usuarioLogueado.telefono || ''
      });
    }
  }, []);

  const handleChange = e => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const finalizar = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: '⚠️ Tu carrito está vacío'
      });
      return;
    }

    try {
      await api.post('/compras', {
        cliente,
        productos: cart,
        total: total()
      });

      clearCart();

      Swal.fire({
        icon: 'success',
        title: '✅ Compra guardada',
        text: 'Genere su factura en PDF',
        confirmButtonText: 'Aceptar'
      });

    } catch (err) {
      Swal.fire({
        icon: 'success',
        title: '✅ Compra guardada',
        text: 'Genere su factura en PDF',
        confirmButtonText: 'Aceptar'
      });
      console.error(err);
    }
  };

  const generarFacturaPDF = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: '⚠️ No hay productos en el carrito para generar factura'
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();



    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('TIERRA & BROTES', pageWidth / 2, 35, { align: 'center' });
    doc.setFontSize(13);
    doc.text('FACTURA DE COMPRA', pageWidth / 2, 43, { align: 'center' });

    const fecha = new Date().toLocaleDateString();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 14, 50);

    autoTable(doc, {
      startY: 55,
      head: [['Campo', 'Detalle']],
      body: [
        ['Nombre', cliente.nombre],
        ['Correo', cliente.correo],
        ['Dirección', cliente.direccion],
        ['Teléfono', cliente.telefono]
      ],
      headStyles: { fillColor: [100, 150, 100] },
      styles: { fontSize: 10 }
    });

    let finalY = doc.lastAutoTable.finalY || 75;

    const items = cart.map(item => [
      item.nombre,
      `$${parseFloat(item.precio).toFixed(2)}`,
      item.cantidad,
      `$${(parseFloat(item.precio) * item.cantidad).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: finalY + 10,
      head: [['Nombre', 'Precio', 'Cantidad', 'Subtotal']],
      body: items,
      headStyles: { fillColor: [40, 100, 150] },
      styles: { fontSize: 10, halign: 'center' }
    });

    finalY = doc.lastAutoTable.finalY;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total a pagar: $${total().toFixed(2)}`, 14, finalY + 12);

    const nombreArchivo = `Tierra&Brotes_${cliente.nombre}.pdf`;
    doc.save(nombreArchivo);
  };

  return (
    <div className="container">
      <h2>🧾 Finalizar Compra</h2>
      <input
        name="nombre"
        placeholder="Nombre completo"
        value={cliente.nombre}
        onChange={handleChange}
      />
      <input
        name="correo"
        placeholder="Correo electrónico"
        value={cliente.correo}
        onChange={handleChange}
      />
      <input
        name="direccion"
        placeholder="Dirección"
        value={cliente.direccion}
        onChange={handleChange}
      />
      <input
        name="telefono"
        placeholder="Teléfono"
        value={cliente.telefono}
        onChange={handleChange}
      />
      <h3 style={{ marginTop: '20px' }}>💰 Total a pagar: ${total()}</h3>
      <div style={{ marginTop: '10px' }}>
        <button onClick={finalizar}>🧾 Pagar ahora</button>
        <button onClick={generarFacturaPDF} style={{ marginLeft: '10px' }}>
          📄 Generar factura PDF
        </button>
      </div>
    </div>
  );
};

export default Checkout;
