import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMenu } from "@/hooks/useMenu";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { SearchBar } from "@/components/menu/SearchBar";
import { FoodCard } from "@/components/menu/FoodCard";
import { FoodCardSkeleton } from "@/components/common/Skeleton";
import { StickyCartButton } from "@/components/cart/StickyCartButton";
import { BottomNav } from "@/components/common/BottomNav";
import { ActiveOrdersBanner } from "@/components/order/ActiveOrdersBanner";

export const MenuPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { menu, categories, loading, error } = useMenu();
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return menu.filter((item) => {
      const matchCat = selectedCat === null || item.categoryId === selectedCat;
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menu, selectedCat, search]);

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 bg-stone-50/95 backdrop-blur z-30 px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-stone-900 mb-3">
          เมนูอาหาร · โต๊ะ {tableId}
        </h1>

        {/* Active Orders Banner */}
        <div className="mb-3">
          <ActiveOrdersBanner />
        </div>

        <SearchBar value={search} onChange={setSearch} />
        <div className="mt-3">
          <CategoryTabs
            categories={categories}
            selected={selectedCat}
            onSelect={setSelectedCat}
          />
        </div>
      </header>

      <main className="px-4 mt-2">
        {error && (
          <p className="text-center text-red-500 py-8">⚠️ {error}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))
            : filtered.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onClick={() =>
                    navigate(`/table/${tableId}/menu/${item.id}`)
                  }
                />
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="text-center text-stone-500 py-8">
            ไม่พบเมนูที่ค้นหา
          </p>
        )}
      </main>

      <StickyCartButton />
      <BottomNav />
    </div>
  );
};
