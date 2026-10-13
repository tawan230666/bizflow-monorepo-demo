import { useEffect, useState } from "react";
import { paymentApi } from "@/api/paymentApi";
import { useSocket } from "@/hooks/useSocket";
import type { Payment } from "@/types";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatPrice } from "@/utils/formatPrice";
import { formatTime, timeAgo } from "@/utils/formatDate";
import { toast } from "@/components/common/Toast";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";

export const CashierPage = () => {
  const socket = useSocket();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    paymentApi
      .getAll("pending")
      .then(setPayments)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Auto refresh เพราะ payments อาจมาจากลูกค้าที่กดสร้าง QR
  useEffect(() => {
    const interval = setInterval(() => {
      paymentApi.getAll("pending").then(setPayments);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Socket — listen for new payments
  useEffect(() => {
    if (!socket) return;
    socket.emit("join-kitchen"); // Cashier ก็ join kitchen room ด้วย

    const handleStatusChange = () => {
      paymentApi.getAll("pending").then(setPayments);
    };

    socket.on("order:new", handleStatusChange);
    socket.on("payment:received", handleStatusChange);

    return () => {
      socket.off("order:new", handleStatusChange);
      socket.off("payment:received", handleStatusChange);
    };
  }, [socket]);

  const handleConfirmPayment = async (paymentId: number) => {
    if (!confirm("ยืนยันว่ารับเงินจากลูกค้าแล้ว?")) return;

    setProcessing(paymentId);
    try {
      await paymentApi.markAsPaid(paymentId);
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      toast.success("✅ ยืนยันการชำระเงินเรียบร้อย");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard /> Cashier
          </h1>
          <p className="text-slate-600 mt-1">
            รายการชำระเงินรอดำเนินการ ({payments.length})
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
      ) : payments.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-slate-500">ไม่มีรายการรอชำระ</p>
          <p className="text-sm text-slate-400 mt-2">
            รายการจะแสดงเมื่อลูกค้ากดสร้าง QR ชำระเงิน
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-6 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500">โต๊ะ / ออเดอร์</p>
                  <p className="text-xl font-bold">
                    T{payment.tableNumber} ·{" "}
                    <span className="font-mono text-sm">
                      {payment.orderNumber}
                    </span>
                  </p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                  <Clock size={12} className="mr-1" />
                  รอชำระ
                </Badge>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">ยอดชำระ</span>
                  <span className="text-3xl font-bold text-sky-600">
                    {formatPrice(payment.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>วิธีชำระ: {payment.method === "promptpay" ? "PromptPay" : "เงินสด"}</span>
                  <span>
                    สร้าง {formatTime(payment.createdAt)} · {timeAgo(payment.createdAt)}
                  </span>
                </div>
              </div>

              <Button
                fullWidth
                variant="success"
                size="lg"
                onClick={() => handleConfirmPayment(payment.id)}
                disabled={processing === payment.id}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} />
                  {processing === payment.id
                    ? "กำลังยืนยัน..."
                    : "ยืนยันรับเงินแล้ว"}
                </div>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
