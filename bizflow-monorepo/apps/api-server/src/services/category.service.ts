import { prisma } from "@/config/database";

export const categoryService = {
  getAll: async () => {
    return prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    });
  },
};
