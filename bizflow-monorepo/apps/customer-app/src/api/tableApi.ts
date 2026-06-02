import axiosClient from "./axiosClient";

export interface Table {
  id: number;
  tableNumber: number;
  qrCode: string | null;
  status: "available" | "occupied" | "reserved";
}

export const tableApi = {
  getAll: (): Promise<Table[]> => axiosClient.get("/tables"),
  getById: (id: number): Promise<Table> => axiosClient.get(`/tables/${id}`),
};
