import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60s timeout to allow Render free tier cold-start to wake up
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject the JWT token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle Render cold-starts and rate-limiting gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      error.friendlyMessage = "The server is taking longer than usual (Render free server is likely waking up). Please try again in 10 seconds.";
    } else if (error.response?.status === 429) {
      error.friendlyMessage = error.response.data?.message || "Too many requests right now. Please wait a moment.";
    } else if (!error.response && error.request) {
      error.friendlyMessage = "Unable to reach server. The backend may be waking up, please refresh shortly.";
    }
    return Promise.reject(error);
  }
);

export default api;
