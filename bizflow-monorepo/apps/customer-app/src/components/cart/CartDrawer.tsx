import { useCartStore } from "@/store/cartStore";
import { CartItem } from "./CartItem";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "../common/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer = ({ open, onClose, onCheckout }: Props) => {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotal());

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-stone-50 rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">ตะกร้าของคุณ</h3>
          <button onClick={onClose} className="text-stone-500">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-center text-stone-500 py-8">
              ยังไม่มีสินค้าในตะกร้า
            </p>
          ) : (
            items.map((item) => <CartItem key={item.cartItemId} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white">
            <div className="flex justify-between mb-3">
              <span className="text-stone-600">ยอดรวม</span>
              <span className="font-semibold text-lg text-amber-600">
                {formatPrice(total)}
              </span>
            </div>
            <Button fullWidth onClick={onCheckout}>
              สั่งอาหาร
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
