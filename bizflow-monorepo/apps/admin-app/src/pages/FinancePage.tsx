import React, { useState } from 'react';

export default function FinancePage() {
  // ข้อมูลภาพรวม
  const [financeData] = useState({
    revenue: 150000,
    expenses: 120000,
  });

  // ข้อมูลที่มาของรายได้ (แบ่งตามหมวดหมู่)
  const [incomeSources] = useState([
    { id: 1, category: 'อาหารจานหลัก', amount: 80000 },
    { id: 2, category: 'เครื่องดื่ม', amount: 45000 },
    { id: 3, category: 'ของทานเล่น / ของหวาน', amount: 25000 },
  ]);

  // ข้อมูลเมนูขายดี
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
      
      {/* ส่วนที่ 1: การ์ดสรุปยอดรวม */}
      <div className="finance-cards">
        <div className="card">
          <h3>รายได้รวม</h3>
          <p className="amount">฿{financeData.revenue.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>รายจ่ายรวม</h3>
          <p className="amount">฿{financeData.expenses.toLocaleString()}</p>
        </div>
        <div className="card highlight">
          <h3>กำไร (ขาดทุน) สุทธิ</h3>
          <p 
            className="amount" 
            style={{ color: isProfit ? '#10b981' : '#ef4444' }}
          >
            {isProfit ? '+' : ''}฿{netProfit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ส่วนที่ 2: รายละเอียดแหล่งที่มาของเงินและเมนูขายดี */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
        
        {/* ตารางที่มาของรายได้ */}
        <div className="detail-section">
          <h3 style={{ marginBottom: '16px', color: '#374151' }}>📊 ที่มาของรายได้</h3>
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
                  <td style={{ textAlign: 'right' }}>{source.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ตารางเมนูขายดีที่สุด */}
        <div className="detail-section">
          <h3 style={{ marginBottom: '16px', color: '#374151' }}>🔥 อาหารที่ขายดีที่สุด</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>เมนู</th>
                <th style={{ textAlign: 'center' }}>จำนวน (จาน/แก้ว)</th>
                <th style={{ textAlign: 'right' }}>รายได้ (฿)</th>
              </tr>
            </thead>
            <tbody>
              {/* ใช้ .sort() เพื่อเรียงลำดับจากขายได้เยอะสุดไปน้อยสุด */}
              {topItems.sort((a, b) => b.qty - a.qty).map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td style={{ textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right' }}>{item.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}