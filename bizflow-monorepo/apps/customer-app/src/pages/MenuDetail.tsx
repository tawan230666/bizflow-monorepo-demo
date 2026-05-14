import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { menuApi } from "@/api/menuApi";
import { useCartStore } from "@/store/cartStore";
import type { MenuItem, MenuOption } from "@/types/menu";
import { OptionSelector } from "@/components/menu/OptionSelector";
import { Button } from "@/components/common/Button";
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "@/components/common/Toast";

export const MenuDetail = () => {
  const { tableId, itemId } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    menuApi
      .getMenuById(Number(itemId))
      .then(setItem)
      .finally(() => setLoading(false));
  }, [itemId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">กำลังโหลด...</p>
      </div>
    );
  }

  if (!item) return <p className="p-4">ไม่พบเมนู</p>;

  const optionsPrice = selectedOptions.reduce((s, o) => s + o.extraPrice, 0);
  const total = (item.price + optionsPrice) * quantity;

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      basePrice: item.price,
      quantity,
      selectedOptions,
      note: note.trim() || undefined,
    });
    toast.success("เพิ่มลงตะกร้าแล้ว");
    navigate(`/table/${tableId}/menu`);
  };

  return (
    <div className="min-h-screen pb-28 bg-stone-50">
      <div className="aspect-square bg-stone-100 relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
        >
          ←
        </button>
      </div>

      <div className="px-4 py-5 space-y-5">
        <div>
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <p className="text-stone-600 mt-2">{item.description}</p>
          <p className="text-amber-600 font-semibold text-xl mt-3">
            {formatPrice(item.price)}
          </p>
        </div>

        {item.options.length > 0 && (
          <OptionSelector
            options={item.options}
            selected={selectedOptions}
            onChange={setSelectedOptions}
          />
        )}

        <div>
          <h4 className="font-medium mb-2">หมายเหตุ</h4>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย"
            rows={2}
            className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-full bg-stone-200"
          >
            −
          </button>
          <span className="text-xl font-semibold w-10 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-full bg-amber-600 text-white"
          >
            +
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4">
        <Button fullWidth onClick={handleAdd}>
          เพิ่มลงตะกร้า · {formatPrice(total)}
        </Button>
      </div>
    </div>
  );
};
