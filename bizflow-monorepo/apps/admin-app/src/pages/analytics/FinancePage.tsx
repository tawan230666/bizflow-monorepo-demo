import React, { useState } from 'react';

export default function FinancePage() {
  const [financeData] = useState({
    revenue: 150000,
    costOfGoods: 45000,
    operatingExpenses: 32000,
    otherExpenses: 18000,
  });

  const [incomeSources] = useState([
    { id: 1, category: 'อาหารจานหลัก', amount: 80000 },
    { id: 2, category: 'เครื่องดื่ม', amount: 45000 },
    { id: 3, category: 'ของหวาน / ของทานเล่น', amount: 25000 },
  ]);

  const [expenseBreakdown] = useState([
    { id: 1, category: 'ค่าแรงพนักงาน', amount: 18000 },
    { id: 2, category: 'ค่าวัตถุดิบ', amount: 24000 },
    { id: 3, category: 'ค่าเช่าสถานที่', amount: 12000 },
    { id: 4, category: 'ค่าไฟ/น้ำ', amount: 6000 },
  ]);

  const [topItems] = useState([
    { id: 101, name: 'ชาเย็น', qty: 410, revenue: 16400 },
    { id: 102, name: 'ผัดไทยกุ้งสด', qty: 320, revenue: 25600 },
    { id: 103, name: 'กะเพราหมูกรอบ', qty: 285, revenue: 17100 },
    { id: 104, name: 'ชาเฉาก๊วย', qty: 230, revenue: 13800 },
  ]);

  const grossProfit = financeData.revenue - financeData.costOfGoods;
  const netProfit = financeData.revenue - financeData.costOfGoods - financeData.operatingExpenses - financeData.otherExpenses;
  const isProfit = netProfit >= 0;

  return (
    <div className="page-container">
      {/* 🟢 แก้ไขตรงนี้: เพิ่ม </div> ปิดแท็กที่หายไปให้ครบ */}
      <div className="page-header">
        <div>
          <h2>💰 Finance & Accounting</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>ดูงบการเงิน พร้อมภาพรวม Cash Flow และโครงสร้างต้นทุน</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card">
          <div className="kpi-title">รายได้รวม</div>
          <div className="kpi-value mono">฿{financeData.revenue.toLocaleString()}</div>
        </div>

        <div className="card">
          <div className="kpi-title">ต้นทุนขาย (COGS)</div>
          <div className="kpi-value mono" style={{ color: 'var(--loss)' }}>฿{financeData.costOfGoods.toLocaleString()}</div>
        </div>

        <div className="card">
          <div className="kpi-title">กำไรขั้นต้น</div>
          <div className="kpi-value mono" style={{ color: 'var(--profit)' }}>฿{grossProfit.toLocaleString()}</div>
        </div>

        <div className="card" style={{ border: `1px solid ${isProfit ? 'var(--profit)' : 'var(--loss)'}40`, background: isProfit ? 'var(--profit-bg)' : 'var(--loss-bg)' }}>
          <div className="kpi-title" style={{ color: isProfit ? 'var(--profit)' : 'var(--loss)' }}>กำไรสุทธิ</div>
          <div className="kpi-value mono" style={{ color: isProfit ? 'var(--profit)' : 'var(--loss)' }}>
            {isProfit ? '+' : ''}฿{netProfit.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>📊 ที่มาของรายได้</h3>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th>หมวดหมู่</th>
                <th style={{ textAlign: 'right' }}>ยอดขาย (฿)</th>
              </tr>
            </thead>
            <tbody>
              {incomeSources.map(source => (
                <tr key={source.id}>
                  <td style={{ fontWeight: 600 }}>{source.category}</td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }}>฿{source.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>💸 ต้นทุนและค่าใช้จ่าย</h3>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th>รายการค่าใช้จ่าย</th>
                <th style={{ textAlign: 'right' }}>จำนวน (฿)</th>
              </tr>
            </thead>
            <tbody>
              {expenseBreakdown.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.category}</td>
                  <td className="mono" style={{ textAlign: 'right', color: 'var(--text-muted)' }}>฿{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>🔥 เมนูขายดีที่สุด</h3>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th>เมนู</th>
                <th style={{ textAlign: 'center' }}>จำนวน</th>
                <th style={{ textAlign: 'right' }}>รายได้ (฿)</th>
              </tr>
            </thead>
            <tbody>
              {topItems.sort((a, b) => b.qty - a.qty).map((item, index) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: index === 0 ? 'var(--warning)' : 'var(--text-main)' }}>{item.name} {index === 0 && '👑'}</td>
                  <td className="mono" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{item.qty}</td>
                  <td className="mono" style={{ textAlign: 'right', color: 'var(--profit)', fontWeight: 600 }}>฿{item.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}