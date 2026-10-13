import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — แนบ token ถ้ามี
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data + handle error กลาง
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "เกิดข้อผิดพลาดในการเชื่อมต่อ";

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
