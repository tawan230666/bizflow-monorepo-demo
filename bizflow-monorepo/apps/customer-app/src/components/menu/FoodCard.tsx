import type { MenuItem } from "@/types/menu";
import { formatPrice } from "@/utils/formatPrice";

interface Props {
  item: MenuItem;
  onClick: () => void;
}

export const FoodCard = ({ item, onClick }: Props) => {
  // placeholder ที่มีชื่อเมนู (แทน "No Image" เปล่า ๆ)
  const fallbackUrl = `https://placehold.co/300x300/f5f5f4/a8a29e?text=${encodeURIComponent(
    item.name,
  )}`;

  return (
    <button
      onClick={onClick}
      disabled={!item.available}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left disabled:opacity-50"
    >
      <div className="aspect-square bg-stone-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            // กัน error loop: ถ้า fallback เองก็ error ให้หยุด
            if (img.src !== fallbackUrl) {
              img.src = fallbackUrl;
            }
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-stone-900 line-clamp-1">{item.name}</h3>
        <p className="text-xs text-stone-500 line-clamp-2 mt-1">
          {item.description}
        </p>
        <p className="text-amber-600 font-semibold mt-2">
          {formatPrice(item.price)}
        </p>
        {!item.available && (
          <p className="text-xs text-red-500 mt-1">หมดแล้ว</p>
        )}
      </div>
    </button>
  );
};
