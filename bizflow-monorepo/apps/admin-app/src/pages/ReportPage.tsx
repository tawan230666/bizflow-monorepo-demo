import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ReportPage() {
  // 1. ฐานข้อมูลจำลอง แยกตามช่วงเวลา (วัน, สัปดาห์, เดือน, ปี)
  const dataSets: Record<string, any[]> = {
    daily: [
      { name: '08:00', profit: 800, revenue: 1500, expense: 700, items: [{ id: 1, name: 'กาแฟร้อน', qty: 20, revenue: 1000 }, { id: 2, name: 'แซนด์วิช', qty: 10, revenue: 500 }] },
      { name: '12:00', profit: 2500, revenue: 4000, expense: 1500, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 30, revenue: 2400 }, { id: 2, name: 'ชาเย็น', qty: 40, revenue: 1600 }] },
      { name: '16:00', profit: 1200, revenue: 2200, expense: 1000, items: [{ id: 1, name: 'ชาเย็น', qty: 25, revenue: 1000 }, { id: 2, name: 'เค้กช็อกโกแลต', qty: 15, revenue: 1200 }] },
      { name: '20:00', profit: 3900, revenue: 6000, expense: 2100, items: [{ id: 1, name: 'ผัดไทยกุ้งสด', qty: 40, revenue: 3200 }, { id: 2, name: 'ต้มยำกุ้ง', qty: 15, revenue: 2800 }] },
    ],
    weekly: [
      { name: 'จันทร์', profit: 4000, revenue: 6000, expense: 2000, items: [{ id: 1, name: 'ผัดไทย', qty: 30, revenue: 2400 }, { id: 2, name: 'ชาเย็น', qty: 50, revenue: 2000 }] },
      { name: 'อังคาร', profit: 3000, revenue: 5000, expense: 2000, items: [{ id: 1, name: 'กะเพราไก่', qty: 40, revenue: 2800 }] },
      { name: 'พุธ', profit: 5500, revenue: 8000, expense: 2500, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 20, revenue: 3000 }] },
      { name: 'พฤหัสฯ', profit: 4800, revenue: 7000, expense: 2200, items: [{ id: 1, name: 'ข้าวผัดปู', qty: 35, revenue: 2800 }] },
      { name: 'ศุกร์', profit: 7200, revenue: 10000, expense: 2800, items: [{ id: 1, name: 'หมึกย่าง', qty: 45, revenue: 5400 }] },
      { name: 'เสาร์', profit: 8400, revenue: 12000, expense: 3600, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 60, revenue: 4800 }, { id: 2, name: 'ชาเย็น', qty: 100, revenue: 4000 }] },
      { name: 'อาทิตย์', profit: 9500, revenue: 14000, expense: 4500, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 40, revenue: 6000 }, { id: 2, name: 'ผัดไทย', qty: 50, revenue: 4000 }] },
    ],
    monthly: [
      { name: 'สัปดาห์ 1', profit: 24000, revenue: 35000, expense: 11000, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 150, revenue: 12000 }, { id: 2, name: 'ชาเย็น', qty: 300, revenue: 12000 }] },
      { name: 'สัปดาห์ 2', profit: 22500, revenue: 32000, expense: 9500, items: [{ id: 1, name: 'ผัดไทย', qty: 140, revenue: 11200 }, { id: 2, name: 'ชาเย็น', qty: 280, revenue: 11200 }] },
      { name: 'สัปดาห์ 3', profit: 28000, revenue: 40000, expense: 12000, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 100, revenue: 15000 }, { id: 2, name: 'หมึกย่าง', qty: 80, revenue: 9600 }] },
      { name: 'สัปดาห์ 4', profit: 31000, revenue: 45000, expense: 14000, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 120, revenue: 18000 }, { id: 2, name: 'กะเพราหมูกรอบ', qty: 180, revenue: 14400 }] },
    ],
    yearly: [
      { name: 'ม.ค.', profit: 95000, revenue: 140000, expense: 45000, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 600, revenue: 48000 }, { id: 2, name: 'ชาเย็น', qty: 1200, revenue: 48000 }] },
      { name: 'ก.พ.', profit: 88000, revenue: 130000, expense: 42000, items: [{ id: 1, name: 'ผัดไทย', qty: 550, revenue: 44000 }] },
      { name: 'มี.ค.', profit: 110000, revenue: 160000, expense: 50000, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 400, revenue: 60000 }] },
      { name: 'เม.ย.', profit: 125000, revenue: 180000, expense: 55000, items: [{ id: 1, name: 'ชาเย็น', qty: 1500, revenue: 60000 }, { id: 2, name: 'หมึกย่าง', qty: 350, revenue: 42000 }] },
      { name: 'พ.ค.', profit: 105000, revenue: 155000, expense: 50000, items: [{ id: 1, name: 'ผัดไทย', qty: 650, revenue: 52000 }] },
      { name: 'มิ.ย.', profit: 115000, revenue: 165000, expense: 50000, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 700, revenue: 56000 }] },
    ],
  };

  // 2. State จัดการช่วงเวลาที่เลือก
  const [timeframe, setTimeframe] = useState<string>('weekly');
  const activeData = dataSets[timeframe];

  // 3. State จัดการจุดที่กดบนกราฟ
  const [selectedPoint, setSelectedPoint] = useState(activeData[activeData.length - 1]);

  // เมื่อเปลี่ยนช่วงเวลา (Tab) ให้รีเซ็ตจุดที่เลือกเป็นอันล่าสุดของช่วงเวลานั้นเสมอ
  useEffect(() => {
    setSelectedPoint(dataSets[timeframe][dataSets[timeframe].length - 1]);
  }, [timeframe]);

  // คำนวณสถิติภาพรวมเทียบกับจุดก่อนหน้า
  const selectedIndex = activeData.findIndex(d => d.name === selectedPoint.name);
  const currentProfit = selectedPoint.profit;
  const previousProfit = selectedIndex > 0 ? activeData[selectedIndex - 1].profit : currentProfit; 
  
  const profitDiff = currentProfit - previousProfit;
  const profitPercent = previousProfit > 0 ? (profitDiff / previousProfit) * 100 : 0;
  const isPositive = profitDiff >= 0;

  // จำลองข้อมูลหมวดหมู่ (Bar Chart) ให้ล้อตามช่วงเวลา
  const categoryMultiplier = timeframe === 'daily' ? 1 : timeframe === 'weekly' ? 7 : timeframe === 'monthly' ? 30 : 180;
  const categoryData = [
    { name: 'จานหลัก', profit: 4500 * categoryMultiplier },
    { name: 'เครื่องดื่ม', profit: 2500 * categoryMultiplier },
    { name: 'ของหวาน', profit: 1400 * categoryMultiplier },
  ];

  // ตั้งค่ากราฟ
  const chartAxisColor = "#9CA3AF";
  const chartGridColor = "#2A2F40";
  const tooltipStyle = { backgroundColor: '#151924', borderColor: '#2A2F40', color: '#F3F4F6', borderRadius: '8px' };

  // Helper สำหรับชื่อปุ่ม
  const timeframeLabels: Record<string, string> = {
    daily: 'รายวัน',
    weekly: 'รายสัปดาห์',
    monthly: 'รายเดือน',
    yearly: 'รายปี'
  };

  return (
    <div className="page-container">
      {/* Header และ แถบเลือกช่วงเวลา (Tabs) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0 }}>📊 Market Overview & Analytics</h2>
        
        {/* กลุ่มปุ่ม Tab สไตล์พรีเมียม */}
        <div style={{ display: 'flex', background: '#11151F', padding: '4px', borderRadius: '12px', border: '1px solid #2A2F40' }}>
          {Object.keys(timeframeLabels).map((key) => (
            <button
              key={key}
              onClick={() => setTimeframe(key)}
              style={{
                background: timeframe === key ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: timeframe === key ? '#3B82F6' : '#9CA3AF',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: timeframe === key ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Inter'
              }}
            >
              {timeframeLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* สถิติรวม */}
      <div className="finance-cards" style={{ marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ textTransform: 'none' }}>กำไรช่วงนี้ ({selectedPoint.name})</h3>
          <p className="amount">฿{currentProfit.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3 style={{ textTransform: 'none' }}>ช่วงก่อนหน้า</h3>
          <p className="amount">฿{previousProfit.toLocaleString()}</p>
        </div>
        <div className={`card highlight ${isPositive ? 'positive' : 'negative'}`}>
          <h3 style={{ textTransform: 'none' }}>เติบโต (Growth)</h3>
          <p className="amount" style={{ color: isPositive ? 'var(--profit)' : 'var(--loss)', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '8px' }}>{profitDiff !== 0 ? (isPositive ? '▲' : '▼') : '-'}</span>
            {isPositive && profitDiff > 0 ? '+' : ''}฿{Math.abs(profitDiff).toLocaleString()} 
            <span style={{ fontSize: '18px', marginLeft: '12px', opacity: 0.9 }}>
              ({isPositive && profitDiff > 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
            </span>
          </p>
        </div>
      </div>

      {/* กราฟ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '40px' }}>
        
        {/* กราฟเส้น */}
        <div className="card">
          <h3 style={{ marginBottom: '24px' }}>📈 Profit Trend <span style={{ color: '#3B82F6', fontSize: '12px', fontWeight: 'normal', marginLeft: '8px' }}>(Click points to view details)</span></h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart 
                data={activeData} 
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                onClick={(state) => {
                  if (state && state.activePayload) {
                    setSelectedPoint(state.activePayload[0].payload);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                <XAxis dataKey="name" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 13 }} />
                <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 13, fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#10B981', fontFamily: 'JetBrains Mono' }} formatter={(value: number) => `฿${value}`} />
                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Net Profit" 
                  stroke="#10B981" 
                  strokeWidth={4} 
                  dot={{ fill: '#151924', stroke: '#10B981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 9, fill: '#10B981', stroke: '#fff' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* กราฟแท่ง */}
        <div className="card">
          <h3 style={{ marginBottom: '24px' }}>📊 Revenue by Category ({timeframeLabels[timeframe]})</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                <XAxis dataKey="name" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 13 }} />
                <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 13, fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#3B82F6', fontFamily: 'JetBrains Mono' }} formatter={(value: number) => `฿${value}`} />
                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                <Bar dataKey="profit" name="Revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* เจาะลึกข้อมูลของจุดที่เลือก (Dynamic) */}
      <h2 style={{ borderTop: '1px solid var(--border-light)', paddingTop: '32px', color: '#FCD34D' }}>
        📌 เจาะลึกข้อมูลประจำ: {selectedPoint.name}
      </h2>
      
      <div className="finance-cards" style={{ marginBottom: '24px' }}>
         <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px' }}>รายได้ (Revenue)</h3>
          <p className="amount" style={{ fontSize: '28px', color: '#3B82F6' }}>฿{selectedPoint.revenue.toLocaleString()}</p>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px' }}>รายจ่าย (Expense)</h3>
          <p className="amount" style={{ fontSize: '28px', color: 'var(--text-muted)' }}>฿{selectedPoint.expense.toLocaleString()}</p>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px' }}>กำไร (Net Profit)</h3>
          <p className="amount" style={{ fontSize: '28px', color: 'var(--profit)' }}>฿{selectedPoint.profit.toLocaleString()}</p>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <h3 style={{ padding: '24px 24px 0' }}>🔥 รายการอาหารที่ขายได้ (ยอดขายสูงสุดในรอบนี้)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>เมนู</th>
              <th style={{ textAlign: 'center' }}>จำนวน</th>
              <th style={{ textAlign: 'right' }}>รายได้รวม (฿)</th>
            </tr>
          </thead>
          <tbody>
            {[...selectedPoint.items]
              .sort((a, b) => b.revenue - a.revenue)
              .map((item, index) => (
              <tr key={item.id}>
                <td className="number" style={{ color: 'var(--text-muted)' }}>{index + 1}</td>
                <td style={{ color: index === 0 ? '#FCD34D' : 'var(--text-main)', fontWeight: index === 0 ? 'bold' : 'normal' }}>
                  {item.name} {index === 0 && '👑'}
                </td>
                <td className="number" style={{ textAlign: 'center' }}>{item.qty.toLocaleString()}</td>
                <td className="number" style={{ textAlign: 'right', color: 'var(--profit)' }}>{item.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}