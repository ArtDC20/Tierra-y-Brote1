import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlantList from './components/PlantList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import PlantForm from './components/PlantForm';
import RutaPrivada from './components/RutaPrivada';
import RutaAdmin from './components/RutaAdmin';
import Register from './pages/Register';
import ComprasAdmin from './pages/ComprasAdmin';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PlantList />} />
        <Route path="/carrito" element={<RutaPrivada><Cart /></RutaPrivada>} />
        <Route path="/checkout" element={<RutaPrivada><Checkout /></RutaPrivada>} />
        <Route path="/agregar" element={<RutaAdmin><PlantForm /></RutaAdmin>} />
        <Route path="/register" element={<Register />} />
        <Route path="/compras-admin" element={<RutaAdmin><ComprasAdmin /></RutaAdmin>} /> {/* ✅ nueva ruta */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
