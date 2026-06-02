import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTableStore } from "@/store/tableStore";

export const TableEntry = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const setTableId = useTableStore((s) => s.setTableId);

  useEffect(() => {
    // แปลงค่าจาก URL ให้เป็นตัวเลข
    const id = Number(tableId);

    // ตรวจสอบว่า id เป็นตัวเลขที่ถูกต้องหรือไม่
    if (!isNaN(id) && id > 0) {
      setTableId(id);
      navigate(`/table/${id}/menu`, { replace: true });
    } else {
      // หากไม่ใช่ตัวเลข หรือไม่มีค่า ให้พากลับไปที่หน้าแรก
      console.warn("Invalid Table ID");
      navigate("/", { replace: true });
    }
  }, [tableId, setTableId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-stone-500">กำลังเปิดเมนู...</p>
    </div>
  );
};
