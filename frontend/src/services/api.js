import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api'
});

api.interceptors.request.use(config => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario?.token) {
    config.headers.Authorization = `Bearer ${usuario.token}`;
  }
  return config;
});

export default api;
