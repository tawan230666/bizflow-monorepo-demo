import { prisma } from "@/config/database";

export const tableService = {
  getAll: async () => {
    return prisma.table.findMany({
      orderBy: { tableNumber: "asc" },
      select: {
        id: true,
        tableNumber: true,
        qrCode: true,
        status: true,
      },
    });
  },

  getById: async (id: number) => {
    return prisma.table.findUnique({
      where: { id },
      select: {
        id: true,
        tableNumber: true,
        qrCode: true,
        status: true,
      },
    });
  },
};
