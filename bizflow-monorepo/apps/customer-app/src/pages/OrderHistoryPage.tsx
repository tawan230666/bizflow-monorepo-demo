import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderStore } from "@/store/orderStore";
import { orderApi } from "@/api/orderApi";
import { BottomNav } from "@/components/common/BottomNav";
import { formatPrice } from "@/utils/formatPrice";
import type { OrderStatus } from "@/types/order";

interface StatusInfo {
  label: string;
  emoji: string;
  color: string;
}

const STATUS_INFO: Record<OrderStatus, StatusInfo> = {
  pending: { label: "รอดำเนินการ", emoji: "⏳", color: "bg-amber-100 text-amber-800 border-amber-200" },
  cooking: { label: "กำลังปรุง", emoji: "🔥", color: "bg-blue-100 text-blue-800 border-blue-200" },
  served: { label: "เสิร์ฟแล้ว", emoji: "✅", color: "bg-green-100 text-green-800 border-green-200" },
  paid: { label: "ชำระเงินแล้ว", emoji: "💰", color: "bg-stone-100 text-stone-700 border-stone-200" },
};

export const OrderHistoryPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const history = useOrderStore((s) => s.history);
  const updateHistoryStatus = useOrderStore((s) => s.updateHistoryStatus);

  const currentTableId = Number(tableId);

  // ✅ Filter history เฉพาะของโต๊ะนี้
  const tableHistory = useMemo(
    () => history.filter((h) => h.tableId === currentTableId),
    [history, currentTableId]
  );

  // Refresh status ของออเดอร์ที่ยัง active ของโต๊ะนี้
  useEffect(() => {
    const activeOrders = tableHistory.filter((h) => h.status !== "paid");
    activeOrders.forEach((h) => {
      orderApi
        .getOrderById(h.orderId)
        .then((order) => updateHistoryStatus(h.orderId, order.status))
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString("th-TH", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white px-4 py-3 border-b border-stone-200 sticky top-0 z-30">
        <h1 className="font-bold text-lg">📜 ออเดอร์ของฉัน</h1>
        <p className="text-xs text-stone-500">โต๊ะ {tableId}</p>
      </header>

      <main className="p-4">
        {tableHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-stone-500 mb-2">
              ยังไม่มีออเดอร์สำหรับโต๊ะ {tableId}
            </p>
            <p className="text-sm text-stone-400 mb-6">
              เริ่มสั่งอาหารจานแรกของคุณกัน!
            </p>
            <button
              onClick={() => navigate(`/table/${tableId}/menu`)}
              className="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700"
            >
              ดูเมนูอาหาร
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tableHistory.map((order) => {
              const info = STATUS_INFO[order.status];
              return (
                <button
                  key={order.orderId}
                  onClick={() =>
                    navigate(`/table/${tableId}/order/${order.orderId}`)
                  }
                  className="w-full bg-white rounded-2xl p-4 text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs text-stone-500">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {formatTime(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${info.color}`}
                    >
                      {info.emoji} {info.label}
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-3 pt-3 border-t border-stone-100">
                    <span className="text-sm text-stone-500">ยอดรวม</span>
                    <span className="font-semibold text-amber-600">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>

                  {order.status !== "paid" && (
                    <p className="text-xs text-stone-400 mt-2">
                      👆 กดเพื่อดูสถานะ
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
