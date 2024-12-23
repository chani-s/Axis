import axios from "axios";

export const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response Interceptor to handle unauthorized errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      document.cookie = "authToken=; Max-Age=0; path=/";
      localStorage.removeItem("authToken");
      localStorage.removeItem("userDetails");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);