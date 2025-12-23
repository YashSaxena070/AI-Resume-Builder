import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ AUTO Content-Type handling
    if (config.data instanceof FormData) {
      // ❌ Do NOT set Content-Type
      // Axios will automatically set multipart/form-data with boundary
      delete config.headers["Content-Type"];
    } else {
      // JSON request
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
