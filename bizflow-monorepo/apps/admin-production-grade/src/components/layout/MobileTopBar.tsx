import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/kitchen": "Kitchen Display",
  "/cashier": "Cashier",
  "/menu": "Menu Management",
};

interface Props {
  onMenuClick: () => void;
}

export const MobileTopBar = ({ onMenuClick }: Props) => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "BizFlow Admin";

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 h-14 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-slate-100"
        aria-label="เมนู"
      >
        <Menu size={22} />
      </button>
      <h1 className="font-semibold text-slate-900">{title}</h1>
    </header>
  );
};
