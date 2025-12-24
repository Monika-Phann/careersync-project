// careersync-mentor/src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  // Point to the Edu Backend where the Mentor data lives
  baseURL: 'http://localhost:8081/api/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;