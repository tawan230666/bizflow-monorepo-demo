import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { paymentApi } from "@/api/paymentApi";
import { orderApi } from "@/api/orderApi";
import { useOrderStore } from "@/store/orderStore";
import { useOrderSocket } from "@/hooks/useOrderSocket";
import { PaymentQR } from "@/components/order/PaymentQR";
import { Button } from "@/components/common/Button";
import { toast } from "@/components/common/Toast";
import { formatPrice } from "@/utils/formatPrice";
import type { Payment } from "@/types/order";

export const PaymentPage = () => {
  const { tableId, orderId } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((s) => s.currentOrder);
  const setOrder = useOrderStore((s) => s.setOrder);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔒 Guard: ไม่ให้สร้าง QR ซ้ำ (ใช้ ref เพื่อข้าม React StrictMode double-call)
  const qrCreated = useRef(false);

  // 🔔 Listen for "payment:received" via socket
  useOrderSocket(Number(orderId));

  const isPaid = order?.status === "paid";

  // Load order if not in store
  useEffect(() => {
    if (!order || order.id !== Number(orderId)) {
      orderApi.getOrderById(Number(orderId)).then(setOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Create QR — ครั้งเดียวเท่านั้น!
  useEffect(() => {
    if (!order || isPaid) return;
    if (qrCreated.current) return; // 🔒 กันสร้างซ้ำ
    qrCreated.current = true;

    paymentApi
      .createPromptPay({ orderId: Number(orderId), amount: order.totalPrice })
      .then(setPayment)
      .catch((err: Error) => {
        toast.error(err.message);
        qrCreated.current = false; // ถ้า error → ลองใหม่ได้
      })
      .finally(() => setLoading(false));
  }, [order, orderId, isPaid]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">กำลังโหลด...</p>
      </div>
    );
  }

  if (isPaid) {
    return <PaymentSuccessView order={order} tableId={tableId!} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-stone-200 sticky top-0 z-30">
        <button onClick={() => navigate(-1)}>←</button>
        <h1 className="font-semibold">ชำระเงิน</h1>
      </header>

      <main className="p-4 space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-stone-200 border-t-amber-600 rounded-full mx-auto mb-3" />
            <p className="text-stone-500">กำลังสร้าง QR...</p>
          </div>
        ) : (
          <>
            <PaymentQR
              qrImageUrl={payment?.qrImageUrl}
              amount={order.totalPrice}
            />

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <p className="text-sm font-medium text-amber-800">
                  รอการยืนยันชำระเงิน
                </p>
              </div>
              <p className="text-xs text-amber-700">
                หลังโอนเสร็จ พนักงานจะยืนยันให้ภายในไม่กี่วินาที
              </p>
            </div>
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 max-w-md mx-auto">
        <Button
          fullWidth
          variant="secondary"
          onClick={() => navigate(`/table/${tableId}/menu`)}
        >
          กลับไปที่เมนู
        </Button>
      </div>
    </div>
  );
};

// ============ Success View ============
interface SuccessProps {
  order: { id: number; orderNumber: string; totalPrice: number; items: Array<{ id: number; name: string; quantity: number; price: number }> };
  tableId: string;
}

const PaymentSuccessView = ({ order, tableId }: SuccessProps) => {
  const navigate = useNavigate();
  const clearCurrentOrder = useOrderStore((s) => s.clearOrder);

  useEffect(() => {
    const timer = setTimeout(() => clearCurrentOrder(), 5000);
    return () => clearTimeout(timer);
  }, [clearCurrentOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6 animate-fade-in">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <span className="text-6xl">✓</span>
              </div>
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mt-6">
              ชำระเงินสำเร็จ!
            </h1>
            <p className="text-stone-600 mt-2">
              ขอบคุณที่ใช้บริการครับ 🙏
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
            <div className="text-center pb-4 border-b-2 border-dashed border-stone-200">
              <p className="text-xs text-stone-500">หมายเลขออเดอร์</p>
              <p className="font-mono font-bold text-lg">{order.orderNumber}</p>
            </div>

            <div className="py-4 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-stone-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-dashed border-stone-200 flex justify-between items-center">
              <span className="font-semibold">ยอดรวม</span>
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(order.totalPrice)}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
              <p>📅 {new Date().toLocaleString("th-TH")}</p>
              <p className="mt-1">โต๊ะ {tableId}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(`/table/${tableId}/menu`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>🍜</span>
              <span>กลับไปสั่งอาหารเพิ่ม</span>
            </button>

            <button
              onClick={() => navigate(`/table/${tableId}/orders`)}
              className="w-full bg-white border-2 border-stone-200 hover:bg-stone-50 text-stone-700 py-4 rounded-2xl font-medium transition-colors"
            >
              📜 ดูประวัติการสั่ง
            </button>
          </div>

          <div className="text-center mt-8 text-xs text-stone-500">
            <p>🎉 หวังว่าจะได้ต้อนรับคุณอีกครั้ง</p>
            <p className="mt-1">BizFlow Restaurant</p>
          </div>
        </div>
      </div>
    </div>
  );
};
