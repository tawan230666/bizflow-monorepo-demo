import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/utils/formatPrice";
import { useCartStore } from "@/store/cartStore";

interface Props {
  item: CartItemType;
}

export const CartItem = ({ item }: Props) => {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const optionsPrice = item.selectedOptions.reduce(
    (s, o) => s + o.extraPrice,
    0,
  );
  const totalPrice = (item.basePrice + optionsPrice) * item.quantity;

  return (
    <div className="bg-white rounded-2xl p-4 flex gap-3">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-20 h-20 rounded-xl object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/80x80?text=N/A";
        }}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-stone-900">{item.name}</h4>
        {item.selectedOptions.length > 0 && (
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
            {item.selectedOptions.map((o) => o.optionName).join(", ")}
          </p>
        )}
        {item.note && (
          <p className="text-xs text-amber-700 mt-1">📝 {item.note}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-amber-600">
            {formatPrice(totalPrice)}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200"
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              className="w-7 h-7 rounded-full bg-amber-600 text-white hover:bg-amber-700"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.cartItemId)}
        className="text-stone-400 hover:text-red-500 text-sm self-start"
        aria-label="ลบ"
      >
        ✕
      </button>
    </div>
  );
};
