import axiosClient from "./axiosClient";
import { API_PATHS } from "@/utils/constants";
import type { MenuItem, Category } from "@/types/menu";

export const menuApi = {
  getMenu: (): Promise<MenuItem[]> =>
    axiosClient.get(API_PATHS.MENU),

  getMenuById: (id: number): Promise<MenuItem> =>
    axiosClient.get(API_PATHS.MENU_BY_ID(id)),

  getCategories: (): Promise<Category[]> =>
    axiosClient.get(API_PATHS.CATEGORIES),
};