import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatPrice";

export const StickyCartButton = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const currentTableId = Number(tableId);
  const items = useCartStore((s) => s.cartsByTable[currentTableId]) ?? [];

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => {
    const optionsPrice = i.selectedOptions.reduce(
      (s, o) => s + o.extraPrice,
      0,
    );
    return sum + (i.basePrice + optionsPrice) * i.quantity;
  }, 0);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4 z-40 pointer-events-none">
      <button
        onClick={() => navigate(`/table/${tableId}/cart`)}
        className="pointer-events-auto w-full max-w-md md:max-w-lg mx-auto bg-amber-600 text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg hover:bg-amber-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="bg-white text-amber-600 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">
            {count}
          </span>
          <span className="font-medium">ดูตะกร้า</span>
        </div>
        <span className="font-semibold">{formatPrice(total)}</span>
      </button>
    </div>
  );
};
