import { useEffect, useState, type FormEvent } from "react";
import {
  UtensilsCrossed,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { menuApi, type MenuFormData } from "@/api/menuApi";
import type { MenuItem, Category } from "@/types";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Modal } from "@/components/common/Modal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { toast } from "@/components/common/Toast";
import { formatPrice } from "@/utils/formatPrice";

const emptyForm: MenuFormData = {
  categoryId: 0,
  name: "",
  description: "",
  imageUrl: "",
  price: 0,
  available: true,
};

export const MenuManagementPage = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MenuFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<number | "all">("all");

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [menuData, catData] = await Promise.all([
        menuApi.getAll(),
        menuApi.getCategories(),
      ]);
      setMenus(menuData);
      setCategories(catData);
      if (catData.length > 0 && form.categoryId === 0) {
        setForm((f) => ({ ...f, categoryId: catData[0].id }));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter
  const filtered =
    filterCategory === "all"
      ? menus
      : menus.filter((m) => m.categoryId === filterCategory);

  // === Handlers ===
  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (menu: MenuItem) => {
    setEditingId(menu.id);
    setForm({
      categoryId: menu.categoryId,
      name: menu.name,
      description: menu.description,
      imageUrl: menu.imageUrl,
      price: menu.price,
      available: menu.available,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.imageUrl || form.price <= 0) {
      toast.error("กรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await menuApi.update(editingId, form);
        toast.success("อัพเดทเมนูสำเร็จ");
      } else {
        await menuApi.create(form);
        toast.success("เพิ่มเมนูสำเร็จ");
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (menu: MenuItem) => {
    if (!confirm(`ลบเมนู "${menu.name}" ?\nการลบจะลบ options และข้อมูลที่เกี่ยวข้องทั้งหมด`)) return;
    try {
      await menuApi.delete(menu.id);
      toast.success("ลบเมนูสำเร็จ");
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleToggle = async (menu: MenuItem) => {
    try {
      await menuApi.toggleAvailability(menu.id);
      toast.success(
        menu.available
          ? `🚫 ปิดการขาย "${menu.name}"`
          : `✅ เปิดการขาย "${menu.name}"`
      );
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Toggle failed");
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UtensilsCrossed /> จัดการเมนูอาหาร
          </h1>
          <p className="text-slate-600 mt-1">
            เพิ่ม แก้ไข ลบ และจัดการสถานะเมนู ({menus.length} รายการ)
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="lg">
          <div className="flex items-center gap-2">
            <Plus size={18} />
            เพิ่มเมนูใหม่
          </div>
        </Button>
      </header>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory("all")}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filterCategory === "all"
              ? "bg-sky-600 text-white"
              : "bg-white border border-slate-200 text-slate-700"
          }`}
        >
          ทั้งหมด ({menus.length})
        </button>
        {categories.map((cat) => {
          const count = menus.filter((m) => m.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterCategory === cat.id
                  ? "bg-sky-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner className="h-10 w-10" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-slate-500">ยังไม่มีเมนูในหมวดนี้</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((menu) => (
            <Card key={menu.id} className="overflow-hidden flex flex-col">
              <div className="aspect-square relative bg-slate-100">
                <img
                  src={menu.imageUrl}
                  alt={menu.name}
                  className={`w-full h-full object-cover ${!menu.available ? "opacity-40 grayscale" : ""}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/300x300?text=No+Image";
                  }}
                />
                {!menu.available && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge className="bg-red-600 text-white border-red-600 text-base px-4 py-2">
                      🚫 ของหมด
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-slate-900 line-clamp-1">
                  {menu.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 flex-1">
                  {menu.description}
                </p>

                <div className="flex justify-between items-center mt-3 mb-3">
                  <span className="text-sky-600 font-bold text-lg">
                    {formatPrice(menu.price)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {menu.options.length} options
                  </span>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleToggle(menu)}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      menu.available
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                    title={menu.available ? "ปิดการขาย" : "เปิดการขาย"}
                  >
                    {menu.available ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(menu)}
                    className="p-2 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors flex items-center justify-center"
                    title="แก้ไข"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(menu)}
                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center justify-center"
                    title="ลบ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Add/Edit Form */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                ชื่อเมนู <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="เช่น ผัดไทยกุ้งสด"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                หมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: Number(e.target.value) })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              คำอธิบาย
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="คำอธิบายเมนู..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              URL รูปภาพ <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="https://picsum.photos/seed/foo/500/500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              ใช้ <code className="bg-slate-100 px-1 rounded">picsum.photos/seed/[name]/500/500</code> สำหรับรูปสุ่ม
            </p>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                ราคา (บาท) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="0"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                สถานะ
              </label>
              <label className="flex items-center gap-3 cursor-pointer pt-2.5">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) =>
                    setForm({ ...form, available: e.target.checked })
                  }
                  className="w-5 h-5 accent-sky-600"
                />
                <span className="text-sm">
                  {form.available ? "✅ พร้อมขาย" : "🚫 ปิดการขาย"}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => setModalOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? "กำลังบันทึก..." : editingId ? "บันทึก" : "เพิ่มเมนู"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
