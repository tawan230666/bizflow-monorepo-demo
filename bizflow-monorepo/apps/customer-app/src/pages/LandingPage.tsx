import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tableApi, type Table } from "@/api/tableApi";
import { Skeleton } from "@/components/common/Skeleton";

const STATUS_LABEL = {
  available: "ว่าง",
  occupied: "มีลูกค้า",
  reserved: "จองแล้ว",
};

const STATUS_COLOR = {
  available: "bg-green-100 text-green-700 border-green-300",
  occupied: "bg-amber-100 text-amber-700 border-amber-300",
  reserved: "bg-blue-100 text-blue-700 border-blue-300",
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tableApi
      .getAll()
      .then(setTables)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="text-center py-8">
          <div className="text-5xl mb-3">🍜</div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">BizFlow</h1>
          <p className="text-stone-600">ระบบสั่งอาหารดิจิทัล</p>
        </header>

        {/* Scan QR Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📱</span>
            <div>
              <h2 className="font-semibold text-stone-900">สแกน QR Code</h2>
              <p className="text-sm text-stone-500">
                สแกน QR ที่โต๊ะของคุณเพื่อเริ่มสั่งอาหาร
              </p>
            </div>
          </div>
        </div>

        {/* Manual Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-stone-900 mb-1">
            หรือเลือกโต๊ะของคุณ
          </h2>
          <p className="text-sm text-stone-500 mb-4">
            กดเลขโต๊ะที่คุณนั่งอยู่
          </p>

          <div className="grid grid-cols-3 gap-3">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))
              : tables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() =>
                      navigate(`/table/${table.tableNumber}/menu`)
                    }
                    className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-md ${
                      STATUS_COLOR[table.status]
                    }`}
                  >
                    <span className="text-3xl font-bold">
                      {table.tableNumber}
                    </span>
                    <span className="text-xs mt-1">
                      {STATUS_LABEL[table.status]}
                    </span>
                  </button>
                ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-stone-500 mt-8 space-y-1">
          <p>💡 ทิป: ปกติลูกค้าจะสแกน QR ที่โต๊ะ</p>
          <p>หน้านี้ใช้สำหรับทดสอบหรือเลือกโต๊ะแบบ manual</p>
        </div>
      </div>
    </div>
  );
};
