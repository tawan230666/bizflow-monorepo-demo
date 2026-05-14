import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatPrice";

export const StickyCartButton = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const count = useCartStore((s) => s.getCount());
  const total = useCartStore((s) => s.getTotal());

  if (count === 0) return null;

  return (
    <button
      onClick={() => navigate(`/table/${tableId}/cart`)}
      className="fixed bottom-20 left-4 right-4 bg-amber-600 text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg hover:bg-amber-700 transition-colors z-40 max-w-md mx-auto"
    >
      <div className="flex items-center gap-3">
        <span className="bg-white text-amber-600 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">
          {count}
        </span>
        <span className="font-medium">ดูตะกร้า</span>
      </div>
      <span className="font-semibold">{formatPrice(total)}</span>
    </button>
  );
};
