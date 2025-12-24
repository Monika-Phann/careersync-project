import axios from 'axios'

const axiosInstance = axios.create({
  // Fallback to localhost if the .env variable isn't set yet
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach the token to every request if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle response errors (like 401 Unauthorized) in one place
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Optional: window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance