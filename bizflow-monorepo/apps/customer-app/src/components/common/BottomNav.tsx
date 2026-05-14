import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableId } = useParams();
  const cartCount = useCartStore((s) => s.getCount());
  const history = useOrderStore((s) => s.history);

  const currentTableId = Number(tableId);

  // ✅ Count เฉพาะ active orders ของโต๊ะนี้
  const activeCount = useMemo(
    () =>
      history.filter(
        (h) => h.tableId === currentTableId && h.status !== "paid"
      ).length,
    [history, currentTableId]
  );

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-2 z-40">
      <div className="flex justify-around max-w-md mx-auto">
        <button
          onClick={() => navigate(`/table/${tableId}/menu`)}
          className={`flex flex-col items-center py-2 px-4 ${
            isActive("/menu") ? "text-amber-600" : "text-stone-600"
          }`}
        >
          <span className="text-xl">🍜</span>
          <span className="text-xs mt-1">เมนู</span>
        </button>

        <button
          onClick={() => navigate(`/table/${tableId}/orders`)}
          className={`flex flex-col items-center py-2 px-4 relative ${
            isActive("/orders") ? "text-amber-600" : "text-stone-600"
          }`}
        >
          <span className="text-xl">📜</span>
          <span className="text-xs mt-1">ออเดอร์</span>
          {activeCount > 0 && (
            <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {activeCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate(`/table/${tableId}/cart`)}
          className={`flex flex-col items-center py-2 px-4 relative ${
            isActive("/cart") ? "text-amber-600" : "text-stone-600"
          }`}
        >
          <span className="text-xl">🛒</span>
          <span className="text-xs mt-1">ตะกร้า</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
