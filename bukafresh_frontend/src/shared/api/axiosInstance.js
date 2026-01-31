import axios from "axios";

export const API = axios.create({
  // baseURL: "/api",
  baseURL: import.meta.env.VITE_API_URL,

  headers: { "Content-Type": "application/json" },
});

// Public API instance for endpoints that don't require authentication
export const PublicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptors for better error handling
const handleResponseError = (error) => {
  if (!error.response) {
    // Network error
    if (!navigator.onLine) {
      error.message = "Please check your internet connection and try again.";
    } else {
      error.message = "We're having trouble connecting to our servers. Please try again in a moment.";
    }
  } else if (error.response.status >= 500) {
    error.message = "We're experiencing technical difficulties. Please try again in a few minutes.";
  } else if (error.response.status === 0) {
    error.message = "Please check your internet connection and try again.";
  }
  return Promise.reject(error);
};

API.interceptors.response.use(
  (response) => response,
  handleResponseError
);

PublicAPI.interceptors.response.use(
  (response) => response,
  handleResponseError
);
