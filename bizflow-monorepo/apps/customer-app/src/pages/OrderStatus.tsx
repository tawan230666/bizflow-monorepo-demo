import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderApi } from "@/api/orderApi";
import { useOrderStore } from "@/store/orderStore";
import { useOrderSocket } from "@/hooks/useOrderSocket";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/common/Button";
import { formatPrice } from "@/utils/formatPrice";

export const OrderStatus = () => {
  const { tableId, orderId } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((s) => s.currentOrder);
  const setOrder = useOrderStore((s) => s.setOrder);
  const [accessDenied, setAccessDenied] = useState(false);

  useOrderSocket(order?.id ?? null);

  useEffect(() => {
    const orderIdNum = Number(orderId);
    const tableIdNum = Number(tableId);

    if (!order || order.id !== orderIdNum) {
      orderApi
        .getOrderById(orderIdNum)
        .then((fetched) => {
          // ✅ Security check: order นี้ต้องเป็นของโต๊ะนี้
          if (fetched.tableId !== tableIdNum) {
            setAccessDenied(true);
            return;
          }
          setOrder(fetched);
        })
        .catch(() => setAccessDenied(true));
    }
  }, [orderId, tableId, order, setOrder]);

  // ===== Access Denied =====
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-bold text-lg mb-2">ไม่พบออเดอร์นี้</h2>
          <p className="text-sm text-stone-500 mb-6">
            ออเดอร์นี้อาจเป็นของโต๊ะอื่น หรือถูกลบไปแล้ว
          </p>
          <Button
            fullWidth
            onClick={() => navigate(`/table/${tableId}/menu`)}
          >
            กลับไปเมนูโต๊ะ {tableId}
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      <header className="bg-white px-4 py-3 border-b border-stone-200 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={() => navigate(`/table/${tableId}/menu`)}
          className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-700"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-xs text-stone-500">หมายเลขออเดอร์</p>
          <h1 className="font-bold">{order.orderNumber}</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <OrderTimeline current={order.status} />

        <div className="bg-white rounded-2xl p-4 text-center">
          {order.status === "pending" && (
            <p className="text-stone-700">⏳ ออเดอร์ของคุณกำลังรอเข้าครัว</p>
          )}
          {order.status === "cooking" && (
            <p className="text-amber-700 font-medium">🔥 ครัวกำลังปรุงอาหารของคุณ</p>
          )}
          {order.status === "served" && (
            <p className="text-green-700 font-medium">
              ✅ อาหารถูกเสิร์ฟแล้ว ขอให้ทานให้อร่อยนะคะ
            </p>
          )}
          {order.status === "paid" && (
            <p className="text-blue-700 font-medium">💰 ขอบคุณที่ใช้บริการครับ</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold mb-3">รายการอาหาร</h3>
          <div className="space-y-2">
            {order.items.map((it) => (
              <div
                key={it.id}
                className="flex justify-between text-sm border-b border-stone-100 pb-2 last:border-0"
              >
                <span>{it.name} × {it.quantity}</span>
                <span>{formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-stone-200 font-semibold">
            <span>รวมทั้งสิ้น</span>
            <span className="text-amber-600">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>

        {order.status !== "paid" && (
          <button
            onClick={() => navigate(`/table/${tableId}/menu`)}
            className="w-full bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50 transition-colors rounded-2xl py-4 font-medium"
          >
            + สั่งอาหารเพิ่ม
          </button>
        )}
      </main>

      {order.status === "served" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 max-w-md mx-auto">
          <Button
            fullWidth
            onClick={() => navigate(`/table/${tableId}/payment/${order.id}`)}
          >
            ชำระเงิน · {formatPrice(order.totalPrice)}
          </Button>
        </div>
      )}
    </div>
  );
};
