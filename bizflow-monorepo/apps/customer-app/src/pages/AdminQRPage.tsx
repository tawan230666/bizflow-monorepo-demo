import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { tableApi, type Table } from "@/api/tableApi";
import { Button } from "@/components/common/Button";

export const AdminQRPage = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = window.location.origin;

  useEffect(() => {
    tableApi
      .getAll()
      .then(setTables)
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-stone-50 p-4 print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 print:hidden">
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-stone-500 text-sm mb-2"
            >
              ← กลับหน้าแรก
            </button>
            <h1 className="text-2xl font-bold">🔖 QR Codes สำหรับโต๊ะ</h1>
            <p className="text-stone-600 text-sm mt-1">
              พิมพ์และนำไปติดที่โต๊ะ ลูกค้าสแกนได้ทันที
            </p>
          </div>
          <Button onClick={handlePrint}>🖨️ พิมพ์ทั้งหมด</Button>
        </header>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-stone-500">กำลังโหลด...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
            {tables.map((table) => {
              const url = `${baseUrl}/table/${table.tableNumber}`;
              return (
                <div
                  key={table.id}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm print:shadow-none print:border print:border-stone-300 print:break-inside-avoid"
                >
                  <div className="text-sm text-stone-500 mb-1">โต๊ะ</div>
                  <div className="text-4xl font-bold text-amber-600 mb-4">
                    {table.tableNumber}
                  </div>
                  <div className="flex justify-center mb-3">
                    <div className="p-2 bg-white border-2 border-stone-200 rounded-xl">
                      <QRCodeSVG value={url} size={140} level="M" />
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 break-all">{url}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
