import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const dict: Record<string, any> = {
  th: {
    pageTitle: "📣 Marketing & CRM",
    daily: "รายวัน", weekly: "รายสัปดาห์", monthly: "รายเดือน", yearly: "รายปี",
    profitPeriod: "กำไรช่วงนี้",
    prevPeriod: "ช่วงก่อนหน้า",
    growth: "เติบโต",
    profitTrend: "📈 Profit Trend",
    revByCat: "📊 Revenue by Category",
    drillDown: "📌 Drill Down: ข้อมูลประจำ",
    revenue: "รายได้ (REVENUE)",
    expense: "รายจ่าย (EXPENSE)",
    netProfit: "กำไร (NET PROFIT)",
    rank: "ลำดับ", menu: "เมนูอาหาร", qty: "จำนวนที่ขาย", totalRev: "รายได้รวม (฿)"
  },
  en: {
    pageTitle: "📣 Marketing & CRM",
    daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly",
    profitPeriod: "Current Profit",
    prevPeriod: "Previous Period",
    growth: "Growth",
    profitTrend: "📈 Profit Trend",
    revByCat: "📊 Revenue by Category",
    drillDown: "📌 Drill Down: Data for",
    revenue: "REVENUE",
    expense: "EXPENSE",
    netProfit: "NET PROFIT",
    rank: "Rank", menu: "Menu Item", qty: "Qty Sold", totalRev: "Total Revenue (฿)"
  }
};

export default function ReportPage() {
  const [language, setLanguage] = useState(localStorage.getItem('bizflow_language') || 'th');
  const t = dict[language];

  useEffect(() => {
    const handleLangUpdate = () => setLanguage(localStorage.getItem('bizflow_language') || 'th');
    window.addEventListener('language_updated', handleLangUpdate);
    return () => window.removeEventListener('language_updated', handleLangUpdate);
  }, []);

  const dataSets: Record<string, any[]> = {
    daily: [
      { name: '08:00', profit: 800, revenue: 1500, expense: 700, items: [{ id: 1, name: 'กาแฟร้อน', qty: 20, revenue: 1000 }, { id: 2, name: 'แซนด์วิช', qty: 10, revenue: 500 }] },
      { name: '12:00', profit: 2500, revenue: 4000, expense: 1500, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 30, revenue: 2400 }, { id: 2, name: 'ชาเย็น', qty: 40, revenue: 1600 }] },
      { name: '16:00', profit: 1200, revenue: 2200, expense: 1000, items: [{ id: 1, name: 'ชาเย็น', qty: 25, revenue: 1000 }, { id: 2, name: 'เค้กช็อกโกแลต', qty: 15, revenue: 1200 }] },
      { name: '20:00', profit: 3900, revenue: 6000, expense: 2100, items: [{ id: 1, name: 'ผัดไทยกุ้งสด', qty: 40, revenue: 3200 }, { id: 2, name: 'ต้มยำกุ้ง', qty: 15, revenue: 2800 }] },
    ],
    weekly: [
      { name: 'Mon', profit: 4000, revenue: 6000, expense: 2000, items: [{ id: 1, name: 'ผัดไทย', qty: 30, revenue: 2400 }, { id: 2, name: 'ชาเย็น', qty: 50, revenue: 2000 }] },
      { name: 'Tue', profit: 3000, revenue: 5000, expense: 2000, items: [{ id: 1, name: 'กะเพราไก่', qty: 40, revenue: 2800 }] },
      { name: 'Wed', profit: 5500, revenue: 8000, expense: 2500, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 20, revenue: 3000 }] },
      { name: 'Thu', profit: 4800, revenue: 7000, expense: 2200, items: [{ id: 1, name: 'ข้าวผัดปู', qty: 35, revenue: 2800 }] },
      { name: 'Fri', profit: 7200, revenue: 10000, expense: 2800, items: [{ id: 1, name: 'หมึกย่าง', qty: 45, revenue: 5400 }] },
      { name: 'Sat', profit: 8400, revenue: 12000, expense: 3600, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 60, revenue: 4800 }, { id: 2, name: 'ชาเย็น', qty: 100, revenue: 4000 }] },
      { name: 'Sun', profit: 9500, revenue: 14000, expense: 4500, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 40, revenue: 6000 }, { id: 2, name: 'ผัดไทย', qty: 50, revenue: 4000 }] },
    ],
    monthly: [
      { name: 'Wk 1', profit: 24000, revenue: 35000, expense: 11000, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 150, revenue: 12000 }, { id: 2, name: 'ชาเย็น', qty: 300, revenue: 12000 }] },
      { name: 'Wk 2', profit: 22500, revenue: 32000, expense: 9500, items: [{ id: 1, name: 'ผัดไทย', qty: 140, revenue: 11200 }, { id: 2, name: 'ชาเย็น', qty: 280, revenue: 11200 }] },
      { name: 'Wk 3', profit: 28000, revenue: 40000, expense: 12000, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 100, revenue: 15000 }, { id: 2, name: 'หมึกย่าง', qty: 80, revenue: 9600 }] },
      { name: 'Wk 4', profit: 31000, revenue: 45000, expense: 14000, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 120, revenue: 18000 }, { id: 2, name: 'กะเพราหมูกรอบ', qty: 180, revenue: 14400 }] },
    ],
    yearly: [
      { name: 'Jan', profit: 95000, revenue: 140000, expense: 45000, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 600, revenue: 48000 }, { id: 2, name: 'ชาเย็น', qty: 1200, revenue: 48000 }] },
      { name: 'Feb', profit: 88000, revenue: 130000, expense: 42000, items: [{ id: 1, name: 'ผัดไทย', qty: 550, revenue: 44000 }] },
      { name: 'Mar', profit: 110000, revenue: 160000, expense: 50000, items: [{ id: 1, name: 'ต้มยำกุ้ง', qty: 400, revenue: 60000 }] },
      { name: 'Apr', profit: 125000, revenue: 180000, expense: 55000, items: [{ id: 1, name: 'ชาเย็น', qty: 1500, revenue: 60000 }, { id: 2, name: 'หมึกย่าง', qty: 350, revenue: 42000 }] },
      { name: 'May', profit: 105000, revenue: 155000, expense: 50000, items: [{ id: 1, name: 'ผัดไทย', qty: 650, revenue: 52000 }] },
      { name: 'Jun', profit: 115000, revenue: 165000, expense: 50000, items: [{ id: 1, name: 'กะเพราหมูกรอบ', qty: 700, revenue: 56000 }] },
    ],
  };

  const [timeframe, setTimeframe] = useState<string>('weekly');
  const activeData = dataSets[timeframe];
  const [selectedPoint, setSelectedPoint] = useState(activeData[activeData.length - 1]);

  useEffect(() => {
    setSelectedPoint(dataSets[timeframe][dataSets[timeframe].length - 1]);
  }, [timeframe]);

  const selectedIndex = activeData.findIndex(d => d.name === selectedPoint.name);
  const currentProfit = selectedPoint.profit;
  const previousProfit = selectedIndex > 0 ? activeData[selectedIndex - 1].profit : currentProfit;
  const profitDiff = currentProfit - previousProfit;
  const profitPercent = previousProfit > 0 ? (profitDiff / previousProfit) * 100 : 0;
  const isPositive = profitDiff >= 0;

  const categoryMultiplier = timeframe === 'daily' ? 1 : timeframe === 'weekly' ? 7 : timeframe === 'monthly' ? 30 : 180;
  const categoryData = [
    { name: language === 'th' ? 'จานหลัก' : 'Main Dish', profit: 4500 * categoryMultiplier },
    { name: language === 'th' ? 'เครื่องดื่ม' : 'Drinks', profit: 2500 * categoryMultiplier },
    { name: language === 'th' ? 'ของหวาน' : 'Desserts', profit: 1400 * categoryMultiplier },
  ];

  const chartAxisColor = '#71717a';
  const tooltipStyle = {
    backgroundColor: '#18181b',
    borderColor: '#27272a',
    color: '#f4f4f5',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    padding: '12px'
  };

  const timeframeLabels: Record<string, string> = {
    daily: t.daily,
    weekly: t.weekly,
    monthly: t.monthly,
    yearly: t.yearly
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '52px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{t.pageTitle}</h2>
        <div className="segmented-control">
          {Object.keys(timeframeLabels).map((key) => (
            <button
              key={key}
              onClick={() => setTimeframe(key)}
              className={`segmented-btn ${timeframe === key ? 'active' : ''}`}
            >
              {timeframeLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>{t.profitPeriod} ({selectedPoint.name})</span>
          <span className="mono" style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1 }}>฿{currentProfit.toLocaleString()}</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>{t.prevPeriod}</span>
          <span className="mono" style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1 }}>฿{previousProfit.toLocaleString()}</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>{t.growth}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
            <span className={`delta-badge mono ${isPositive ? 'up' : 'down'}`} style={{ fontSize: '16px', padding: '4px 10px' }}>{profitDiff !== 0 ? (isPositive ? '▲' : '▼') : ''} {Math.abs(profitPercent).toFixed(1)}%</span>
            <span className="mono" style={{ fontSize: '20px', color: isPositive ? 'var(--profit)' : 'var(--loss)', fontWeight: 600 }}>{isPositive && profitDiff > 0 ? '+' : ''}฿{Math.abs(profitDiff).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.profitTrend}</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={activeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} onClick={(state) => { if (state && state.activePayload) { setSelectedPoint(state.activePayload[0].payload); } }} style={{ cursor: 'pointer' }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 12, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--profit)', fontFamily: 'DM Mono', fontWeight: 'bold' }} formatter={(value: number) => `฿${value}`} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="circle"/>
                <Line type="monotone" dataKey="profit" name="Net Profit" stroke="var(--profit)" strokeWidth={3} dot={{ fill: 'var(--bg-card)', stroke: 'var(--profit)', strokeWidth: 2, r: 5 }} activeDot={{ r: 8, fill: 'var(--profit)', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.revByCat}</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis stroke={chartAxisColor} tick={{ fill: chartAxisColor, fontSize: 12, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--accent)', fontFamily: 'DM Mono', fontWeight: 'bold' }} formatter={(value: number) => `฿${value}`} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="circle"/>
                <Bar dataKey="profit" name="Revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '18px', margin: '40px 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'var(--accent)' }}>{t.drillDown}</span> {selectedPoint.name}</h2>
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '32px', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{t.revenue}</div>
            <div className="mono" style={{ fontSize: '20px', color: 'var(--accent)', fontWeight: 600 }}>฿{selectedPoint.revenue.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{t.expense}</div>
            <div className="mono" style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: 600 }}>฿{selectedPoint.expense.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{t.netProfit}</div>
            <div className="mono" style={{ fontSize: '20px', color: 'var(--profit)', fontWeight: 600 }}>฿{selectedPoint.profit.toLocaleString()}</div>
          </div>
        </div>
        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>{t.rank}</th>
              <th>{t.menu}</th>
              <th style={{ textAlign: 'center' }}>{t.qty}</th>
              <th style={{ textAlign: 'right' }}>{t.totalRev}</th>
            </tr>
          </thead>
          <tbody>
            {[...selectedPoint.items].sort((a, b) => b.revenue - a.revenue).map((item, index) => (
              <tr key={item.id}>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>0{index + 1}</td>
                <td style={{ color: index === 0 ? '#FCD34D' : 'var(--text-main)', fontWeight: index === 0 ? 600 : 400 }}>{item.name} {index === 0 && '👑'}</td>
                <td className="mono" style={{ textAlign: 'center' }}>{item.qty.toLocaleString()}</td>
                <td className="mono" style={{ textAlign: 'right', color: 'var(--text-main)', fontWeight: 500 }}>฿{item.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}