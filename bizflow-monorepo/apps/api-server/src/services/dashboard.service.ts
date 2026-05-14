import { prisma } from "@/config/database";

export const dashboardService = {
  getStats: async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      paidOrders,
      todayOrders,
      todayRevenue,
      pendingOrders,
      activeTables,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "paid" } }),
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.aggregate({
        where: { status: "paid", createdAt: { gte: startOfDay } },
        _sum: { totalPrice: true },
      }),
      prisma.order.count({ where: { status: { in: ["pending", "cooking"] } } }),
      prisma.table.count({ where: { status: "occupied" } }),
    ]);

    // Top 5 menus
    const topMenus = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const menuDetails = await prisma.menuItem.findMany({
      where: { id: { in: topMenus.map((m) => m.menuItemId) } },
      select: { id: true, name: true, imageUrl: true },
    });

    const topMenusWithDetails = topMenus.map((tm) => {
      const menu = menuDetails.find((m) => m.id === tm.menuItemId);
      return {
        menuItemId: tm.menuItemId,
        name: menu?.name ?? "Unknown",
        imageUrl: menu?.imageUrl ?? "",
        totalSold: tm._sum.quantity ?? 0,
      };
    });

    return {
      totalOrders,
      paidOrders,
      todayOrders,
      todayRevenue: Number(todayRevenue._sum.totalPrice ?? 0),
      pendingOrders,
      activeTables,
      topMenus: topMenusWithDetails,
    };
  },
};
