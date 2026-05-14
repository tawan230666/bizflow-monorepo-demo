import { useEffect, useState } from "react";
import { orderApi } from "@/api/orderApi";
import { useSocket } from "@/hooks/useSocket";
import type { Order, OrderStatus } from "@/types";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/utils/constants";
import { timeAgo, formatTime } from "@/utils/formatDate";
import { toast } from "@/components/common/Toast";
import { Bell, ChefHat, CheckCircle2 } from "lucide-react";

export const KitchenPage = () => {
  const socket = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrderFlash, setNewOrderFlash] = useState<number | null>(null);

  // Initial load
  useEffect(() => {
    orderApi
      .getActive()
      .then(setOrders)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Socket — Listen for new orders
  useEffect(() => {
    if (!socket) return;

    socket.emit("join-kitchen");

    const handleNewOrder = (order: Order) => {
      setOrders((prev) => [...prev, order]);
      setNewOrderFlash(order.id);
      setTimeout(() => setNewOrderFlash(null), 3000);

      // 🔔 Notification sound
      try {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
        );
        audio.play().catch(() => {});
      } catch (e) {
        // ignore
      }

      toast.info(`🔔 ออเดอร์ใหม่ #${order.orderNumber} จากโต๊ะ ${order.tableNumber}`);
    };

    const handleStatusChange = (data: {
      orderId: number;
      status: OrderStatus;
      order?: Order;
    }) => {
      setOrders((prev) => {
        // ถ้าสถานะเป็น served/paid → ลบออกจาก kitchen view
        if (data.status === "served" || data.status === "paid") {
          return prev.filter((o) => o.id !== data.orderId);
        }
        // ไม่งั้นอัพเดทใน list
        return prev.map((o) =>
          o.id === data.orderId ? { ...o, status: data.status } : o
        );
      });
    };

    socket.on("order:new", handleNewOrder);
    socket.on("order:status", handleStatusChange);

    return () => {
      socket.emit("leave-kitchen");
      socket.off("order:new", handleNewOrder);
      socket.off("order:status", handleStatusChange);
    };
  }, [socket]);

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      toast.success(
        `อัพเดทสถานะเป็น "${ORDER_STATUS_LABEL[newStatus]}" สำเร็จ`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const cookingOrders = orders.filter((o) => o.status === "cooking");

  return (
    <div className="p-4 lg:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ChefHat /> Kitchen Display
          </h1>
          <p className="text-slate-600 mt-1">
            ออเดอร์ที่กำลังดำเนินการ ({orders.length})
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-600">Live</span>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner className="h-10 w-10" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="text-6xl mb-4">😴</div>
          <p className="text-slate-500">ยังไม่มีออเดอร์เข้ามา</p>
          <p className="text-sm text-slate-400 mt-2">
            หน้านี้จะอัพเดทอัตโนมัติเมื่อมีออเดอร์ใหม่
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-amber-600" size={20} />
              <h2 className="font-semibold text-slate-900">
                รอดำเนินการ ({pendingOrders.length})
              </h2>
            </div>
            <div className="space-y-3">
              {pendingOrders.length === 0 ? (
                <p className="text-sm text-slate-400 italic">ไม่มีออเดอร์</p>
              ) : (
                pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    flash={newOrderFlash === order.id}
                    onAction={() => handleStatusChange(order.id, "cooking")}
                    actionLabel="เริ่มปรุง"
                    actionVariant="primary"
                  />
                ))
              )}
            </div>
          </div>

          {/* Cooking Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="text-blue-600" size={20} />
              <h2 className="font-semibold text-slate-900">
                กำลังปรุง ({cookingOrders.length})
              </h2>
            </div>
            <div className="space-y-3">
              {cookingOrders.length === 0 ? (
                <p className="text-sm text-slate-400 italic">ไม่มีออเดอร์</p>
              ) : (
                cookingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAction={() => handleStatusChange(order.id, "served")}
                    actionLabel="เสิร์ฟแล้ว"
                    actionVariant="success"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// === Sub-component ===
interface OrderCardProps {
  order: Order;
  flash?: boolean;
  onAction: () => void;
  actionLabel: string;
  actionVariant: "primary" | "success";
}

const OrderCard = ({
  order,
  flash,
  onAction,
  actionLabel,
  actionVariant,
}: OrderCardProps) => (
  <Card
    className={`p-5 ${flash ? "ring-4 ring-amber-400 animate-fade-in" : "animate-fade-in"}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900">
            T{order.tableNumber}
          </span>
          <Badge className={ORDER_STATUS_COLOR[order.status]}>
            {ORDER_STATUS_LABEL[order.status]}
          </Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1 font-mono">
          {order.orderNumber}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500">{formatTime(order.createdAt)}</p>
        <p className="text-xs text-slate-400">{timeAgo(order.createdAt)}</p>
      </div>
    </div>

    <div className="border-t border-slate-100 pt-3 space-y-2">
      {order.items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <div className="flex-1">
            <p className="font-medium">
              <span className="text-sky-600">{item.quantity}×</span> {item.name}
            </p>
            {item.note && (
              <p className="text-xs text-amber-700 mt-0.5">📝 {item.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>

    <Button
      fullWidth
      onClick={onAction}
      variant={actionVariant}
      size="lg"
      className="mt-4"
    >
      <div className="flex items-center justify-center gap-2">
        <CheckCircle2 size={18} />
        {actionLabel}
      </div>
    </Button>
  </Card>
);
