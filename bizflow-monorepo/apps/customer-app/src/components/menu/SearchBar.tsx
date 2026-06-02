interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="ค้นหาเมนู..."
      className="w-full px-4 py-3 pl-11 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
    />
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
      🔍
    </span>
  </div>
);
