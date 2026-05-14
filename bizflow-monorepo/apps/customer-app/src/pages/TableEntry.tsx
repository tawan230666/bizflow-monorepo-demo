import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTableStore } from "@/store/tableStore";

export const TableEntry = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const setTableId = useTableStore((s) => s.setTableId);

  useEffect(() => {
    const id = Number(tableId);
    if (!isNaN(id)) {
      setTableId(id);
      navigate(`/table/${id}/menu`, { replace: true });
    }
  }, [tableId, setTableId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-stone-500">กำลังเปิดเมนู...</p>
    </div>
  );
};
