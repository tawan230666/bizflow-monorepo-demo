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
      <h2>💰 งบกำไรขาดทุน (P&L)</h2>
      
      {/* การ์ดสรุปยอด */}
      <div className="finance-cards">
        <div className="card">
          <h3>รายได้รวม</h3>
          <p className="amount">฿{financeData.revenue.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>รายจ่ายรวม</h3>
          <p className="amount">฿{financeData.expenses.toLocaleString()}</p>
        </div>
        <div className={`card highlight ${isProfit ? 'positive' : 'negative'}`}>
          <h3>กำไร (ขาดทุน) สุทธิ</h3>
          <p 
            className="amount" 
            style={{ color: isProfit ? 'var(--profit)' : 'var(--loss)' }}
          >
            {isProfit ? '+' : ''}฿{netProfit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ตารางข้อมูล */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
        
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <h3 style={{ padding: '24px 24px 0' }}>📊 ที่มาของรายได้</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>หมวดหมู่</th>
                <th style={{ textAlign: 'right' }}>ยอดขาย (฿)</th>
              </tr>
            </thead>
            <tbody>
              {incomeSources.map(source => (
                <tr key={source.id}>
                  <td>{source.category}</td>
                  <td className="number" style={{ textAlign: 'right' }}>{source.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <h3 style={{ padding: '24px 24px 0' }}>🔥 อาหารที่ขายดีที่สุด</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>เมนู</th>
                <th style={{ textAlign: 'center' }}>จำนวน</th>
                <th style={{ textAlign: 'right' }}>รายได้ (฿)</th>
              </tr>
            </thead>
            <tbody>
              {topItems.sort((a, b) => b.qty - a.qty).map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className="number" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{item.qty}</td>
                  <td className="number" style={{ textAlign: 'right', color: 'var(--profit)' }}>{item.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}