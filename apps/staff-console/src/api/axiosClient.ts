import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT จาก sessionStorage
axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("admin_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors + 401 redirect
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "เกิดข้อผิดพลาด";

    if (error.response?.status === 401) {
      sessionStorage.removeItem("admin_token");
      sessionStorage.removeItem("admin_user");
      sessionStorage.removeItem("bizflow-admin-auth");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
