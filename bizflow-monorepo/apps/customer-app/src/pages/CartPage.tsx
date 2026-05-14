import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { orderApi } from "@/api/orderApi";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/common/Button";
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "@/components/common/Toast";
import { useState } from "react";

export const CartPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotal());
  const clear = useCartStore((s) => s.clear);
  const setOrder = useOrderStore((s) => s.setOrder);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      const order = await orderApi.createOrder({
        tableId: Number(tableId),
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          note: i.note,
          price:
            i.basePrice +
            i.selectedOptions.reduce((s, o) => s + o.extraPrice, 0),
          selectedOptionIds: i.selectedOptions.map((o) => o.id),
        })),
      });

      setOrder(order);
      clear();
      toast.success("สั่งอาหารสำเร็จ!");
      navigate(`/table/${tableId}/order/${order.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-stone-50">
      <header className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3 z-30">
        <button onClick={() => navigate(-1)} className="text-stone-600">
          ←
        </button>
        <h1 className="font-semibold text-lg">ตะกร้าของคุณ</h1>
      </header>

      <main className="px-4 py-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500 mb-4">ยังไม่มีสินค้าในตะกร้า</p>
            <Button
              variant="secondary"
              onClick={() => navigate(`/table/${tableId}/menu`)}
            >
              เลือกเมนู
            </Button>
          </div>
        ) : (
          items.map((item) => <CartItem key={item.cartItemId} item={item} />)
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-stone-600">ยอดรวม</span>
            <span className="font-semibold text-lg text-amber-600">
              {formatPrice(total)}
            </span>
          </div>
          <Button fullWidth onClick={handleCheckout} disabled={submitting}>
            {submitting ? "กำลังส่งออเดอร์..." : "ยืนยันสั่งอาหาร"}
          </Button>
        </div>
      )}
    </div>
  );
};
