import axiosClient from "./axiosClient";
import type { MenuItem, Category } from "@/types";

export interface MenuFormData {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  available: boolean;
}

export const menuApi = {
  getAll: (): Promise<MenuItem[]> => axiosClient.get("/menu"),
  getById: (id: number): Promise<MenuItem> => axiosClient.get(`/menu/${id}`),
  create: (data: MenuFormData): Promise<MenuItem> =>
    axiosClient.post("/menu", data),
  update: (id: number, data: Partial<MenuFormData>): Promise<MenuItem> =>
    axiosClient.put(`/menu/${id}`, data),
  delete: (id: number): Promise<{ success: boolean }> =>
    axiosClient.delete(`/menu/${id}`),
  toggleAvailability: (id: number): Promise<MenuItem> =>
    axiosClient.patch(`/menu/${id}/toggle`),
  getCategories: (): Promise<Category[]> => axiosClient.get("/categories"),
};
