import { useState, useMemo, useEffect } from "react";

type MenuOption = { name: string; price: number };
type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  options?: MenuOption[];
};
type CartItem = MenuItem & {
  cartItemId: string;
  quantity: number;
  selectedOptions: MenuOption[];
};
type OrderReceipt = {
  id: string;
  table: string;
  items: CartItem[];
  total: number;
  date: string;
  status: "pending" | "completed";
};

const INITIAL_MENU: MenuItem[] = [
  {
    id: "1",
    name: "ข้าวกะเพราหมูกรอบ",
    category: "Main",
    price: 65,
    image: "/images/menu-1.jpg",
    description: "หมูกรอบชิ้นโต ผัดกะเพรารสจัดจ้าน",
    options: [
      { name: "เพิ่มไข่ดาว", price: 15 },
      { name: "พิเศษ", price: 20 },
    ],
  },
  {
    id: "2",
    name: "ข้าวผัดต้มยำทะเล",
    category: "Main",
    price: 80,
    image: "/images/menu-2.jpg",
    description: "ข้าวผัดเครื่องต้มยำ กุ้งปลาหมึกเน้นๆ",
    options: [{ name: "เพิ่มไข่ดาว", price: 15 }],
  },
  {
    id: "3",
    name: "เฟรนช์ฟรายส์",
    category: "Snack",
    price: 49,
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80",
    description: "ทอดกรอบใหม่ๆ ร้อนๆ",
    options: [
      { name: "ผงชีส", price: 10 },
      { name: "ผงปาปริก้า", price: 10 },
    ],
  },
  {
    id: "4",
    name: "ไก่ทอดสไตล์เกาหลี",
    category: "Snack",
    price: 120,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80",
    description: "ไก่ทอดกรอบคลุกซอสเผ็ดเกาหลี",
  },
  {
    id: "5",
    name: "ชานมไข่มุก",
    category: "Drink",
    price: 45,
    image: "/images/menu-5.jpg",
    description: "ชานมไต้หวันแท้ หอมหวานละมุน",
    options: [
      { name: "หวานน้อย 50%", price: 0 },
      { name: "ไม่หวาน 0%", price: 0 },
      { name: "เพิ่มไข่มุก", price: 10 },
    ],
  },
  {
    id: "6",
    name: "น้ำแตงโมปั่น",
    category: "Drink",
    price: 50,
    image: "/images/menu-6.jpg",
    description: "แตงโมสดปั่นเย็นชื่นใจ",
  },
];

const CATEGORIES = ["All", "Main", "Snack", "Drink"];
const CATEGORY_ICONS: Record<string, string> = {
  All: "🍽️",
  Main: "🍛",
  Snack: "🍟",
  Drink: "🧋",
};
const MOCK_TABLES = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

const MenuImage = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const isImgSrc =
    src.startsWith("http") ||
    src.startsWith("data:image") ||
    src.startsWith("/");
  if (isImgSrc && !imgError)
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 w-full h-full ${className}`}
    >
      {imgError ? "🍽️" : src}
    </div>
  );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<
    "tables" | "menu" | "receipt" | "admin"
  >("tables");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<OrderReceipt | null>(null);
  const [isFromQR, setIsFromQR] = useState<boolean>(false);
  const [selectedMenuToAdd, setSelectedMenuToAdd] = useState<MenuItem | null>(null);
  const [tempOptions, setTempOptions] = useState<MenuOption[]>([]);

  const [allOrders, setAllOrders] = useState<OrderReceipt[]>(() =>
    JSON.parse(localStorage.getItem("bizflow_orders") || "[]"),
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() =>
    JSON.parse(
      localStorage.getItem("bizflow_menu") || JSON.stringify(INITIAL_MENU),
    ),
  );

  const [adminTab, setAdminTab] = useState<"orders" | "manage_menu">("orders");
  const [editingItem, setEditingItem] = useState<MenuItem | null | "new">(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});

  useEffect(() => {
    if (editingItem || selectedMenuToAdd)
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [editingItem, selectedMenuToAdd]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("admin") === "true") setCurrentStep("admin");
    const tableFromUrl = searchParams.get("table");
    if (tableFromUrl) {
      setTableNumber(tableFromUrl);
      setIsFromQR(true);
      setCurrentStep("menu");
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedOrders = localStorage.getItem("bizflow_orders");
      if (savedOrders) setAllOrders(JSON.parse(savedOrders));
      const savedMenu = localStorage.getItem("bizflow_menu");
      if (savedMenu) setMenuItems(JSON.parse(savedMenu));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      (item.price + (item.selectedOptions?.reduce((s, o) => s + o.price, 0) || 0)) *
        item.quantity,
    0,
  );

  const filteredMenu = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          (selectedCategory === "All" || item.category === selectedCategory) &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, selectedCategory, menuItems],
  );

  const handleItemClick = (item: MenuItem) => {
    if (item.options && item.options.length > 0) {
      setSelectedMenuToAdd(item);
      setTempOptions([]);
    } else {
      confirmAddToCart(item, []);
    }
  };

  const toggleTempOption = (option: MenuOption) => {
    setTempOptions((prev) =>
      prev.find((o) => o.name === option.name)
        ? prev.filter((o) => o.name !== option.name)
        : [...prev, option],
    );
  };

  const confirmAddToCart = (item: MenuItem, selectedOpts: MenuOption[]) => {
    setCart((prev) => {
      const cartItemId = `${item.id}-${selectedOpts.map((o) => o.name).sort().join(",")}`;
      const existing = prev.find((c) => c.cartItemId === cartItemId);
      if (existing)
        return prev.map((c) =>
          c.cartItemId === cartItemId ? { ...c, quantity: c.quantity + 1 } : c,
        );
      return [...prev, { ...item, cartItemId, quantity: 1, selectedOptions: selectedOpts }];
    });
    setSelectedMenuToAdd(null);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.cartItemId === cartItemId ? { ...c, quantity: c.quantity + delta } : c,
        )
        .filter((c) => c.quantity > 0),
    );
  };

  const handleSelectTable = (table: string) => {
    setTableNumber(table);
    window.history.pushState({}, "", `?table=${table}`);
    setCurrentStep("menu");
  };

  const handleCheckout = () => {
    const newOrder: OrderReceipt = {
      id: Date.now().toString(),
      table: tableNumber,
      items: [...cart],
      total: totalPrice,
      date: new Date().toLocaleString("th-TH"),
      status: "pending",
    };
    const updatedOrders = [...allOrders, newOrder];
    setAllOrders(updatedOrders);
    localStorage.setItem("bizflow_orders", JSON.stringify(updatedOrders));
    setLastOrder(newOrder);
    setCurrentStep("receipt");
  };

  const handleOrderMore = () => {
    setCart([]);
    setCurrentStep("menu");
  };

  const handleNewOrder = () => {
    setCart([]);
    setSearchQuery("");
    setSelectedCategory("All");
    setLastOrder(null);
    if (isFromQR) {
      setCurrentStep("menu");
    } else {
      setTableNumber("");
      window.history.pushState({}, "", window.location.pathname);
      setCurrentStep("tables");
    }
  };

  const saveToLocalStorage = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      alert("❌ ไม่สามารถบันทึกข้อมูลได้: รูปภาพใหญ่เกินไป กรุณาใช้รูปลิงก์ URL หรือรูปขนาดเล็กลงครับ");
    }
  };

  const handleSaveMenu = () => {
    let updatedMenu = [...menuItems];
    const validOptions = (formData.options || []).filter(
      (o) => o.name.trim() !== "",
    );
    if (editingItem === "new") {
      updatedMenu.push({
        id: Date.now().toString(),
        name: formData.name || "เมนูใหม่",
        category: formData.category || "Main",
        price: Number(formData.price) || 0,
        image: formData.image || "🍽️",
        description: formData.description || "",
        options: validOptions,
      });
    } else if (editingItem) {
      updatedMenu = updatedMenu.map((item) =>
        item.id === editingItem.id
          ? ({ ...item, ...formData, options: validOptions } as MenuItem)
          : item,
      );
    }
    setMenuItems(updatedMenu);
    saveToLocalStorage("bizflow_menu", updatedMenu);
    setEditingItem(null);
  };

  const handleDeleteMenu = (id: string) => {
    if (confirm("🗑️ แน่ใจหรือไม่ว่าต้องการลบเมนูนี้?")) {
      const updatedMenu = menuItems.filter((item) => item.id !== id);
      setMenuItems(updatedMenu);
      saveToLocalStorage("bizflow_menu", updatedMenu);
    }
  };

  const restoreDefaultMenu = () => {
    if (confirm("ต้องการล้างข้อมูลเมนูทั้งหมดและคืนค่าเริ่มต้นใช่หรือไม่?")) {
      setMenuItems(INITIAL_MENU);
      saveToLocalStorage("bizflow_menu", INITIAL_MENU);
    }
  };

  const completeOrder = (orderId: string) => {
    const updatedOrders = allOrders.map((order) =>
      order.id === orderId ? { ...order, status: "completed" as const } : order,
    );
    setAllOrders(updatedOrders);
    saveToLocalStorage("bizflow_orders", updatedOrders);
  };

  const cancelOrder = (orderId: string) => {
    if (confirm("คุณต้องการ 'ยกเลิก' และลบบิลนี้ทิ้งใช่หรือไม่?")) {
      const updatedOrders = allOrders.filter((order) => order.id !== orderId);
      setAllOrders(updatedOrders);
      saveToLocalStorage("bizflow_orders", updatedOrders);
    }
  };

  const clearCompletedOrders = () => {
    const pendingOnly = allOrders.filter((o) => o.status === "pending");
    setAllOrders(pendingOnly);
    saveToLocalStorage("bizflow_orders", pendingOnly);
  };

  // ================= Admin Dashboard =================
  if (currentStep === "admin") {
    const pendingOrders = allOrders.filter((o) => o.status === "pending");
    const completedOrders = allOrders.filter((o) => o.status === "completed");
    const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
    const uniqueTables = new Set(allOrders.map((o) => o.table)).size;

    return (
      <div className="flex h-screen font-sans overflow-hidden bg-[#f8f7f4]">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shadow-sm z-20 shrink-0">
          {/* Logo */}
          <div className="px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-xl">
                🍲
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-gray-900">Biz</span>
                <span className="text-orange-500 italic">Flow</span>
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-2 ml-0.5">
              Admin Dashboard
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-0.5">
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest px-3 py-2">เมนูหลัก</p>
            <button
              onClick={() => setAdminTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                adminTab === "orders"
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">📋</span>
              <span>ออเดอร์ลูกค้า</span>
              {pendingOrders.length > 0 && (
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${adminTab === "orders" ? "bg-white/30 text-white" : "bg-orange-500 text-white"}`}>
                  {pendingOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAdminTab("manage_menu")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                adminTab === "manage_menu"
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">🍔</span>
              <span>จัดการเมนู</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => {
                setCurrentStep("tables");
                window.history.pushState({}, "", window.location.pathname);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
            >
              <span>🏠</span>
              <span>หน้าสั่งอาหาร</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {adminTab === "orders" && (
            <div className="p-6 md:p-8 max-w-7xl">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">ออเดอร์วันนี้</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date().toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={clearCompletedOrders}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl hover:bg-gray-50 transition text-sm font-medium shadow-sm"
                >
                  🗑️ ล้างบิลเสร็จแล้ว
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">รอเสิร์ฟ</p>
                  <p className="text-3xl font-black text-orange-500">{pendingOrders.length}</p>
                  <p className="text-xs text-gray-400 mt-1">ออเดอร์</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm">
                  <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">เสร็จแล้ว</p>
                  <p className="text-3xl font-black text-green-500">{completedOrders.length}</p>
                  <p className="text-xs text-gray-400 mt-1">ออเดอร์</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">โต๊ะที่ใช้</p>
                  <p className="text-3xl font-black text-blue-500">{uniqueTables}</p>
                  <p className="text-xs text-gray-400 mt-1">โต๊ะ</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">ยอดรวม</p>
                  <p className="text-3xl font-black text-purple-500">฿{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">บาท</p>
                </div>
              </div>

              {/* Orders */}
              {allOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 text-center py-24 text-gray-400">
                  <p className="text-5xl mb-3">🍽️</p>
                  <p className="font-semibold text-gray-500">ยังไม่มีออเดอร์เข้ามา</p>
                  <p className="text-sm mt-1">ออเดอร์จากลูกค้าจะแสดงที่นี่</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {[...allOrders].reverse().map((order) => (
                    <div
                      key={order.id}
                      className={`bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden border transition-opacity ${
                        order.status === "pending" ? "border-orange-200" : "border-gray-100 opacity-50"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${order.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                            {order.table}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm leading-none">โต๊ะ {order.table}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          order.status === "pending"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                        }`}>
                          {order.status === "pending" ? "⏳ กำลังทำ" : "✅ เสิร์ฟแล้ว"}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="px-5 py-4 flex-1 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.cartItemId} className="flex justify-between items-start text-sm">
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 w-5 h-5 bg-orange-500 text-white text-xs font-black rounded-md flex items-center justify-center shrink-0">
                                {item.quantity}
                              </span>
                              <div>
                                <p className="font-semibold text-gray-800 leading-tight">{item.name}</p>
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                  <p className="text-xs text-orange-400 mt-0.5">
                                    + {item.selectedOptions.map((o) => o.name).join(", ")}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="text-gray-500 text-xs font-semibold shrink-0 ml-2 mt-0.5">
                              ฿{(item.price + (item.selectedOptions?.reduce((s, o) => s + o.price, 0) || 0)) * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm font-black text-gray-700">฿{order.total}</p>
                        <p className="text-xs text-gray-400">{order.items.reduce((s, i) => s + i.quantity, 0)} รายการ</p>
                      </div>

                      {order.status === "pending" && (
                        <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 font-bold py-2 rounded-xl transition text-sm"
                          >
                            ยกเลิก
                          </button>
                          <button
                            onClick={() => completeOrder(order.id)}
                            className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl transition text-sm shadow-sm"
                          >
                            ✓ เสิร์ฟแล้ว
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {adminTab === "manage_menu" && (
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">จัดการเมนูอาหาร</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{menuItems.length} รายการในระบบ</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={restoreDefaultMenu}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-50 transition shadow-sm"
                  >
                    🔄 คืนค่าเริ่มต้น
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem("new");
                      setFormData({ category: "Main", image: "", options: [] });
                    }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-sm shadow-orange-200"
                  >
                    + เพิ่มเมนู
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3.5 text-xs font-black text-gray-400 uppercase tracking-widest w-20">รูป</th>
                      <th className="px-5 py-3.5 text-xs font-black text-gray-400 uppercase tracking-widest">ชื่อเมนู</th>
                      <th className="px-5 py-3.5 text-xs font-black text-gray-400 uppercase tracking-widest">หมวด</th>
                      <th className="px-5 py-3.5 text-xs font-black text-gray-400 uppercase tracking-widest">ราคา</th>
                      <th className="px-5 py-3.5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/30 transition group">
                        <td className="px-5 py-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                            <MenuImage src={item.image} alt={item.name} className="text-xl" />
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                          )}
                          {item.options && item.options.length > 0 && (
                            <p className="text-xs text-orange-400 mt-0.5">{item.options.length} ตัวเลือกเสริม</p>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1 text-xs font-bold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full border border-orange-100">
                            {CATEGORY_ICONS[item.category]} {item.category}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-black text-gray-900">฿{item.price}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setFormData({ ...item, options: item.options ? [...item.options] : [] });
                              }}
                              className="bg-gray-100 text-gray-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition text-xs"
                            >
                              แก้ไข
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(item.id)}
                              className="bg-gray-100 text-gray-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100 hover:text-red-600 transition text-xs"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Edit / Add Modal */}
          {editingItem && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-base">
                      {editingItem === "new" ? "✨" : "✏️"}
                    </div>
                    <h2 className="font-black text-gray-900">
                      {editingItem === "new" ? "เพิ่มเมนูใหม่" : "แก้ไขเมนู"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2 rounded-xl text-gray-500 font-medium text-sm hover:bg-gray-100 transition"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSaveMenu}
                      className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition shadow-sm"
                    >
                      บันทึก
                    </button>
                  </div>
                </header>

                <div className="flex flex-col md:flex-row overflow-hidden flex-1 min-h-0">
                  {/* Image Panel */}
                  <div className="md:w-64 bg-gray-50 border-r border-gray-100 flex flex-col items-center justify-center p-6 shrink-0">
                    <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-lg bg-white border-2 border-white ring-1 ring-gray-100 mb-4">
                      <MenuImage src={formData.image || ""} alt="Preview" className="text-6xl" />
                    </div>
                    <label className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl cursor-pointer transition font-bold text-sm">
                      📁 เลือกรูป
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) return alert("รูปใหญ่เกิน 2MB ครับ");
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setFormData({ ...formData, image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="หรือวาง URL รูปภาพ"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full mt-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-center text-xs outline-none focus:border-orange-400 text-gray-600"
                    />
                  </div>

                  {/* Form Panel */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-5 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-black text-gray-400 mb-1.5 uppercase tracking-widest">ชื่ออาหาร</label>
                          <input
                            type="text"
                            required
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="เช่น ข้าวผัดกุ้ง"
                            className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 font-bold text-gray-900 focus:bg-white focus:border-orange-400 transition outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 mb-1.5 uppercase tracking-widest">ราคา (฿)</label>
                          <input
                            type="number"
                            required
                            value={formData.price ?? ""}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 font-black text-orange-500 focus:bg-white focus:border-orange-400 transition outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 mb-1.5 uppercase tracking-widest">หมวดหมู่</label>
                          <select
                            value={formData.category || "Main"}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 font-semibold focus:bg-white focus:border-orange-400 outline-none"
                          >
                            {CATEGORIES.filter((c) => c !== "All").map((c) => (
                              <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-black text-gray-400 mb-1.5 uppercase tracking-widest">คำบรรยาย</label>
                          <input
                            type="text"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="บอกรายละเอียดเมนูสั้นๆ"
                            className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-gray-700 focus:bg-white focus:border-orange-400 transition outline-none"
                          />
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div className="border-t border-gray-100 pt-5">
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-black text-gray-800 text-sm">ตัวเลือกเสริม</p>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, options: [...(formData.options || []), { name: "", price: 0 }] })
                            }
                            className="text-orange-500 hover:text-orange-600 font-bold text-sm flex items-center gap-1"
                          >
                            + เพิ่ม
                          </button>
                        </div>
                        <div className="space-y-2">
                          {formData.options?.map((opt, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-orange-50 px-3 py-2.5 rounded-xl border border-orange-100">
                              <input
                                type="text"
                                placeholder="ชื่อตัวเลือก"
                                value={opt.name}
                                onChange={(e) => {
                                  const opts = (formData.options || []).map((o, i) =>
                                    i === idx ? { ...o, name: e.target.value } : o,
                                  );
                                  setFormData({ ...formData, options: opts });
                                }}
                                className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
                              />
                              <div className="flex items-center gap-1 border-l border-orange-200 pl-2">
                                <span className="text-gray-400 text-xs">+฿</span>
                                <input
                                  type="number"
                                  value={opt.price}
                                  onChange={(e) => {
                                    const opts = (formData.options || []).map((o, i) =>
                                      i === idx ? { ...o, price: Number(e.target.value) } : o,
                                    );
                                    setFormData({ ...formData, options: opts });
                                  }}
                                  className="w-16 bg-transparent outline-none text-sm font-black text-orange-500"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    options: (formData.options || []).filter((_, i) => i !== idx),
                                  })
                                }
                                className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          {(!formData.options || formData.options.length === 0) && (
                            <p className="text-xs text-gray-400 text-center py-2">ยังไม่มีตัวเลือกเสริม</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ================= หน้าเลือกโต๊ะ =================
  if (currentStep === "tables") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg mb-5 ring-1 ring-orange-100">
              <span className="text-4xl">🍲</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Biz</span>
              <span className="text-4xl md:text-5xl font-black tracking-tight text-orange-500 italic">Flow</span>
            </div>
            <p className="text-gray-400 text-base">เลือกโต๊ะของคุณเพื่อเริ่มสั่งอาหาร</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm ring-1 ring-orange-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
              เลือกโต๊ะ
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {MOCK_TABLES.map((table) => (
                <button
                  key={table}
                  onClick={() => handleSelectTable(table)}
                  className="group bg-white hover:bg-orange-500 border-2 border-gray-100 hover:border-orange-500 rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-200 shadow-sm hover:shadow-lg active:scale-95"
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                    🍽️
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-orange-100 transition-colors">โต๊ะ</span>
                  <span className="text-xl font-black text-gray-800 group-hover:text-white transition-colors leading-tight">
                    {table}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-300 mt-6">
            สแกน QR โค้ดที่โต๊ะ หรือเลือกโต๊ะด้านบน
          </p>
        </div>
      </div>
    );
  }

  // ================= ใบเสร็จ =================
  if (currentStep === "receipt" && lastOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden print:shadow-none print:w-full">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-center p-8 print:bg-transparent print:text-black">
            <div className="flex items-center justify-center gap-1.5 mb-5">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-lg">🍲</div>
              <span className="text-2xl font-black text-white">Biz</span>
              <span className="text-2xl font-black text-white/80 italic">Flow</span>
            </div>
            <div className="w-14 h-14 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-white/40">
              <span className="text-white font-black text-3xl leading-none">✓</span>
            </div>
            <h1 className="text-xl font-black mb-1">สั่งอาหารสำเร็จ!</h1>
            <p className="text-orange-100 print:text-gray-600 text-sm">
              ออเดอร์ถูกส่งเข้าครัวแล้ว กรุณารอสักครู่
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 bg-orange-50 rounded-2xl p-4">
              <div>
                <p className="text-xs text-gray-400 font-medium">โต๊ะที่</p>
                <p className="text-2xl font-black text-orange-500">{lastOrder.table}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium">เวลาสั่ง</p>
                <p className="font-semibold text-gray-700 text-sm">{lastOrder.date}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {lastOrder.items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <p className="text-xs text-orange-500 mt-0.5">
                        + {item.selectedOptions.map((o) => o.name).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      ฿{item.price + (item.selectedOptions?.reduce((s, o) => s + o.price, 0) || 0)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-800">
                    ฿{(item.price + (item.selectedOptions?.reduce((s, o) => s + o.price, 0) || 0)) * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-gray-100 pt-4 flex justify-between items-center mb-6 print:mb-0">
              <span className="font-bold text-gray-600">ยอดรวมทั้งหมด</span>
              <span className="text-3xl font-black text-orange-500 print:text-black">
                ฿{lastOrder.total}
              </span>
            </div>

            <div className="space-y-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition flex justify-center items-center gap-2 text-sm"
              >
                📄 บันทึกบิล / พิมพ์
              </button>
              <button
                onClick={handleOrderMore}
                className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition shadow-md"
              >
                + สั่งอาหารเพิ่ม (โต๊ะเดิม)
              </button>
              <button
                onClick={handleNewOrder}
                className="w-full bg-white text-gray-500 font-medium py-3 rounded-xl hover:bg-gray-50 transition border border-gray-200 text-sm"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= หน้าเมนู =================
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col md:flex-row font-sans">
      {/* ซ้าย: เมนูอาหาร */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Sticky Header */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center text-sm">🍲</div>
              <div>
                <div className="flex items-center gap-0.5 leading-none">
                  <span className="text-base font-black text-gray-900">Biz</span>
                  <span className="text-base font-black text-orange-500 italic">Flow</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">เมนูอาหาร</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
              <span className="text-lg">🍽️</span>
              <div>
                <p className="text-xs text-gray-400 leading-none">โต๊ะที่</p>
                <p className="font-black text-orange-500 leading-tight">{tableNumber}</p>
              </div>
              {!isFromQR && (
                <button
                  onClick={() => {
                    setCurrentStep("tables");
                    setTableNumber("");
                    window.history.pushState({}, "", window.location.pathname);
                  }}
                  className="text-xs text-gray-400 hover:text-orange-500 underline transition ml-1"
                >
                  เปลี่ยน
                </button>
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="🔍 ค้นหาเมนู..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50 transition mb-3"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                {cat === "All" ? "ทั้งหมด" : cat}
              </button>
            ))}
          </div>
        </header>

        {/* Menu Grid */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {filteredMenu.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>ไม่พบเมนูที่ค้นหา</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col border border-gray-100 cursor-pointer group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative h-40 md:h-44 bg-gray-100 overflow-hidden">
                    <MenuImage
                      src={item.image}
                      alt={item.name}
                      className="group-hover:scale-105 transition-transform duration-300 text-5xl"
                    />
                    {item.options && item.options.length > 0 && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                        ปรับแต่งได้
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 leading-tight line-clamp-1 text-sm md:text-base">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-orange-500 font-black text-base md:text-lg">
                        ฿{item.price}
                      </span>
                      <button
                        className="w-8 h-8 bg-orange-500 hover:bg-orange-600 active:scale-90 text-white rounded-full flex items-center justify-center font-bold text-lg transition-all shadow-sm shadow-orange-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ขวา: ตะกร้า */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-l border-gray-100 flex flex-col shadow-2xl md:shadow-none z-10 sticky bottom-0 md:h-screen md:top-0 shrink-0">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900 text-lg">ตะกร้า</h2>
          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} รายการ
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 max-h-[35vh] md:max-h-full">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <span className="text-5xl mb-3 opacity-40">🛒</span>
              <p className="text-gray-400 text-sm">ยังไม่มีรายการ</p>
              <p className="text-gray-300 text-xs mt-1">แตะเมนูเพื่อเพิ่มลงตะกร้า</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-gray-50 rounded-xl p-3 border border-gray-100"
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-tight text-gray-900">{item.name}</p>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <p className="text-xs text-orange-500 mt-0.5">
                        + {item.selectedOptions.map((o) => o.name).join(", ")}
                      </p>
                    )}
                    <p className="text-xs font-bold text-orange-500 mt-1">
                      ฿{item.price + (item.selectedOptions?.reduce((s, o) => s + o.price, 0) || 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, -1)}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 active:scale-90 font-bold text-sm transition-all"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-black text-sm text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, 1)}
                    className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600 active:scale-90 font-bold text-sm transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-4 md:px-5 py-4 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700">รวมทั้งหมด</span>
            <span className="text-2xl font-black text-orange-500">฿{totalPrice}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-2xl font-black text-white text-base transition-all ${
              cart.length === 0
                ? "bg-gray-200 cursor-not-allowed text-gray-400"
                : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 active:scale-[0.98]"
            }`}
          >
            {cart.length === 0 ? "เลือกเมนูก่อนนะคะ" : "ยืนยันการสั่งอาหาร →"}
          </button>
        </div>
      </div>

      {/* Modal เลือกตัวเสริม */}
      {selectedMenuToAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-[110]">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-sm shadow-2xl overflow-hidden">
            <div className="h-52 w-full bg-gray-100 relative">
              <MenuImage
                src={selectedMenuToAdd.image}
                alt={selectedMenuToAdd.name}
                className="text-6xl"
              />
              <button
                onClick={() => setSelectedMenuToAdd(null)}
                className="absolute top-4 right-4 bg-black/30 backdrop-blur text-white w-9 h-9 rounded-full font-bold shadow hover:bg-black/50 transition flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-gray-900 mb-0.5">
                {selectedMenuToAdd.name}
              </h3>
              <p className="text-orange-500 font-black text-lg mb-5">
                ฿{selectedMenuToAdd.price}
              </p>

              {selectedMenuToAdd.options && selectedMenuToAdd.options.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    เลือกตัวเพิ่มเติม
                  </p>
                  <div className="space-y-2">
                    {selectedMenuToAdd.options.map((opt, idx) => {
                      const isSelected = tempOptions.some((o) => o.name === opt.name);
                      return (
                        <label
                          key={idx}
                          className={`flex items-center justify-between p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${
                            isSelected
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-100 hover:border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}>
                              {isSelected && <span className="text-white text-xs font-black">✓</span>}
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{opt.name}</span>
                          </div>
                          <span className="text-gray-400 text-sm font-semibold">
                            {opt.price > 0 ? `+฿${opt.price}` : "ฟรี"}
                          </span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleTempOption(opt)}
                            className="hidden"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => confirmAddToCart(selectedMenuToAdd, tempOptions)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-orange-200 active:scale-[0.98]"
              >
                เพิ่มลงตะกร้า · ฿{selectedMenuToAdd.price + tempOptions.reduce((s, o) => s + o.price, 0)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
