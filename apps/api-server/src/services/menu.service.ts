import { prisma } from "@/config/database";

export const menuService = {
  getAll: async () => {
    const items = await prisma.menuItem.findMany({
      include: { options: true, category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { id: "asc" }],
    });
    return items.map(formatMenuItem);
  },

  getById: async (id: number) => {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { options: true },
    });
    return item ? formatMenuItem(item) : null;
  },

  create: async (data: {
    categoryId: number;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    available: boolean;
  }) => {
    const item = await prisma.menuItem.create({
      data,
      include: { options: true },
    });
    return formatMenuItem(item);
  },

  update: async (
    id: number,
    data: Partial<{
      categoryId: number;
      name: string;
      description: string;
      imageUrl: string;
      price: number;
      available: boolean;
    }>
  ) => {
    const item = await prisma.menuItem.update({
      where: { id },
      data,
      include: { options: true },
    });
    return formatMenuItem(item);
  },

  delete: async (id: number) => {
    await prisma.menuItem.delete({ where: { id } });
    return { success: true };
  },

  toggleAvailability: async (id: number) => {
    const current = await prisma.menuItem.findUnique({ where: { id } });
    if (!current) throw new Error("Menu not found");
    return prisma.menuItem.update({
      where: { id },
      data: { available: !current.available },
    });
  },
};

const formatMenuItem = (item: any) => ({
  id: item.id,
  categoryId: item.categoryId,
  name: item.name,
  description: item.description,
  imageUrl: item.imageUrl,
  price: Number(item.price),
  available: item.available,
  options: item.options?.map((opt: any) => ({
    id: opt.id,
    optionName: opt.optionName,
    optionType: opt.optionType,
    extraPrice: Number(opt.extraPrice),
    groupName: opt.groupName ?? undefined,
  })) ?? [],
});
