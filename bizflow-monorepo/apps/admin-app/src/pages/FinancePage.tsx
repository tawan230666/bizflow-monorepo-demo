import React, { useState } from 'react';

export default function FinancePage() {
  const [financeData] = useState({
    revenue: 150000,
    expenses: 120000,
  });

  const [incomeSources] = useState([
    { id: 1, category: 'อาหารจานหลัก', amount: 80000 },
    { id: 2, category: 'เครื่องดื่ม', amount: 45000 },
    { id: 3, category: 'ของทานเล่น / ของหวาน', amount: 25000 },
  ]);

  const [topItems] = useState([
    { id: 101, name: 'ชาเย็น', qty: 410, revenue: 16400 },
    { id: 102, name: 'ผัดไทยกุ้งสด', qty: 320, revenue: 25600 },
    { id: 103, name: 'กะเพราหมูกรอบ', qty: 285, revenue: 17100 },
    { id: 104, name: 'ต้มยำกุ้ง', qty: 150, revenue: 22500 },
  ]);

  const netProfit = financeData.revenue - financeData.expenses;
  const isProfit = netProfit >= 0;

  return (
    <div className="page-container">
      
      {/* =========================================
          HEADER
          ========================================= */}
      <div className="page-header">
        <h2>💰 งบกำไรขาดทุน (P&L)</h2>
        <button className="btn-outline">📥 Export Report</button>
      </div>
      
      {/* =========================================
          KPI CARDS (สรุปยอดการเงิน)
          ========================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card">
          <div className="kpi-title">รายได้รวม (Total Revenue)</div>
          <div className="kpi-value mono">฿{financeData.revenue.toLocaleString()}</div>
        </div>
        
        <div className="card">
          <div className="kpi-title">รายจ่ายรวม (Total Expenses)</div>
          <div className="kpi-value mono" style={{ color: 'var(--text-muted)' }}>฿{financeData.expenses.toLocaleString()}</div>
        </div>
        
        {/* การ์ดกำไร/ขาดทุน จะไฮไลท์สีพื้นหลังตามสถานะ */}
        <div className="card" style={{ 
          border: `1px solid ${isProfit ? 'var(--profit)' : 'var(--loss)'}40`, 
          background: isProfit ? 'var(--profit-bg)' : 'var(--loss-bg)' 
        }}>
          <div className="kpi-title" style={{ color: isProfit ? 'var(--profit)' : 'var(--loss)' }}>กำไรสุทธิ (Net Profit)</div>
          <div className="kpi-value mono" style={{ color: isProfit ? 'var(--profit)' : 'var(--loss)' }}>
            {isProfit ? '+' : ''}฿{netProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* =========================================
          TABLES (ตารางข้อมูล 2 ฝั่ง)
          ========================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* ตารางที่ 1: ที่มาของรายได้ */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>📊 ที่มาของรายได้ (Revenue Sources)</h3>
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
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }}>
                    ฿{source.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ตารางที่ 2: เมนูขายดีที่สุด */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>🔥 อาหารที่ขายดีที่สุด (Top Items)</h3>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th>เมนู</th>
                <th style={{ textAlign: 'center' }}>จำนวน (จาน/แก้ว)</th>
                <th style={{ textAlign: 'right' }}>รายได้ (฿)</th>
              </tr>
            </thead>
            <tbody>
              {topItems.sort((a, b) => b.qty - a.qty).map((item, index) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: index === 0 ? 'var(--warning)' : 'var(--text-main)' }}>
                    {item.name} {index === 0 && '👑'}
                  </td>
                  <td className="mono" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{item.qty}</td>
                  <td className="mono" style={{ textAlign: 'right', color: 'var(--profit)', fontWeight: 600 }}>
                    ฿{item.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}