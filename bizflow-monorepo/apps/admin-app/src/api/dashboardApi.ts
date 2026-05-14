import axiosClient from "./axiosClient";
import type { DashboardStats } from "@/types";

export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => axiosClient.get("/dashboard/stats"),
};
