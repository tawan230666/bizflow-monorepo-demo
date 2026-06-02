import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderStore } from "@/store/orderStore";

export const ActiveOrdersBanner = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const history = useOrderStore((s) => s.history);

  const currentTableId = Number(tableId);

  // ✅ Filter เฉพาะ active orders ของโต๊ะนี้
  const activeOrders = useMemo(
    () =>
      history.filter(
        (h) => h.tableId === currentTableId && h.status !== "paid"
      ),
    [history, currentTableId]
  );

  if (activeOrders.length === 0) return null;

  const latest = activeOrders[0];

  const statusMessage = {
    pending: "⏳ รอเข้าครัว",
    cooking: "🔥 กำลังปรุง",
    served: "✅ เสิร์ฟแล้ว",
    paid: "",
  }[latest.status];

  return (
    <button
      onClick={() => navigate(`/table/${tableId}/order/${latest.orderId}`)}
      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-3 flex items-center justify-between hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
          🍳
        </div>
        <div className="text-left">
          <p className="font-medium text-sm">
            {activeOrders.length === 1
              ? `มี 1 ออเดอร์: ${statusMessage}`
              : `มี ${activeOrders.length} ออเดอร์กำลังดำเนินการ`}
          </p>
          <p className="text-xs text-amber-100">กดดูรายละเอียด</p>
        </div>
      </div>
      <span className="text-xl">→</span>
    </button>
  );
};
