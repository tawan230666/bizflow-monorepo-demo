import type { Category } from "@/types/menu";

interface Props {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export const CategoryTabs = ({ categories, selected, onSelect }: Props) => (
  <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
    <button
      onClick={() => onSelect(null)}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        selected === null
          ? "bg-amber-600 text-white"
          : "bg-white text-stone-700 border border-stone-200"
      }`}
    >
      ทั้งหมด
    </button>
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onSelect(cat.id)}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === cat.id
            ? "bg-amber-600 text-white"
            : "bg-white text-stone-700 border border-stone-200"
        }`}
      >
        {cat.name}
      </button>
    ))}
  </div>
);
