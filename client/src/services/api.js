import axios from 'axios';

const rawUrl = import.meta.env.VITE_BACKEND_URL || '';
const cleanUrl = rawUrl.replace(/\/+$/, ''); // Remove trailing slashes

export const getBackendUrl = (path) => {
  const cleanPath = (path || '').replace(/^\/+/, '');
  return `${cleanUrl}/${cleanPath}`;
};

const finalUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

const api = axios.create({
  baseURL: finalUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
