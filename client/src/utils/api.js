import axios from "axios";

export const ML_API_URL = import.meta.env.VITE_ML_API_URL || "https://personalized-academic-tracker-1.onrender.com";

// Main backend API
const API_URL = import.meta.env.VITE_API_URL || "https://personalized-academic-tracker-imzr.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mlApi = axios.create({
  baseURL: ML_API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

// ML API doesn't need auth token
mlApi.interceptors.request.use((config) => {
  return config;
});

export default api;
