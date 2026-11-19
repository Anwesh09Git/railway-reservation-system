import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rail_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('rail_token');
    }
    const message = error.response?.data?.message
      ? error.response.data.message
      : error.code === 'ERR_NETWORK'
        ? 'Cannot connect to the server. Is the backend running?'
        : 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
