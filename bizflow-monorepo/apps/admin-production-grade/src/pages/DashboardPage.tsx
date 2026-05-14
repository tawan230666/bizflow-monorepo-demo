import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { dashboardApi } from "@/api/dashboardApi";
import type { DashboardStats } from "@/types";
import { Card } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatPrice, formatNumber } from "@/utils/formatPrice";

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
  color: string;
}) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </Card>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () =>
      dashboardApi.getStats().then(setStats).finally(() => setLoading(false));
    load();

    // Auto refresh every 30 sec
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="h-10 w-10" />
      </div>
    );
  }

  if (!stats) return null;

  const chartData = stats.topMenus.map((m) => ({
    name: m.name.length > 10 ? m.name.slice(0, 10) + "..." : m.name,
    sold: m.totalSold,
  }));

  return (
    <div className="p-4 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">ภาพรวมร้านอาหารของคุณ</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={TrendingUp}
          label="ยอดขายวันนี้"
          value={formatPrice(stats.todayRevenue)}
          color="bg-green-500"
        />
        <StatCard
          icon={ShoppingBag}
          label="ออเดอร์วันนี้"
          value={formatNumber(stats.todayOrders)}
          color="bg-sky-500"
        />
        <StatCard
          icon={Clock}
          label="กำลังดำเนินการ"
          value={formatNumber(stats.pendingOrders)}
          color="bg-amber-500"
        />
        <StatCard
          icon={Users}
          label="โต๊ะที่ใช้งาน"
          value={formatNumber(stats.activeTables)}
          color="bg-purple-500"
        />
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">สรุปรวม</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">ออเดอร์ทั้งหมด</span>
              <span className="font-semibold">
                {formatNumber(stats.totalOrders)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">ออเดอร์ที่ชำระแล้ว</span>
              <span className="font-semibold text-green-600">
                {formatNumber(stats.paidOrders)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">อัตราการชำระเงิน</span>
              <span className="font-semibold">
                {stats.totalOrders > 0
                  ? `${((stats.paidOrders / stats.totalOrders) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" />
            สถานะระบบ
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Backend API</span>
              <span className="text-green-600 ml-auto">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Database</span>
              <span className="text-green-600 ml-auto">Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Socket.io</span>
              <span className="text-green-600 ml-auto">Active</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Menus */}
      <Card className="p-6 mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">
          🏆 เมนูขายดี Top 5
        </h3>
        {chartData.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            ยังไม่มีข้อมูลการขาย
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="sold" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Top Menus Detail */}
      {stats.topMenus.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            รายละเอียดเมนูขายดี
          </h3>
          <div className="space-y-3">
            {stats.topMenus.map((menu, idx) => (
              <div
                key={menu.menuItemId}
                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl"
              >
                <div className="text-2xl font-bold text-slate-400 w-8">
                  #{idx + 1}
                </div>
                <img
                  src={menu.imageUrl}
                  alt={menu.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{menu.name}</p>
                  <p className="text-sm text-slate-500">
                    ขายไปแล้ว {menu.totalSold} จาน
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
