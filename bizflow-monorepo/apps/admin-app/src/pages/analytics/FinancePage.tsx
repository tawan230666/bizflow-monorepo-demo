import React, { useState, useEffect } from 'react';

// 🌐 พจนานุกรม
const dict: Record<string, any> = {
  th: {
    pageTitle: "💰 Finance & Accounting",
    pageDesc: "ดูงบการเงิน พร้อมภาพรวม Cash Flow และโครงสร้างต้นทุน",
    totalRevenue: "รายได้รวม",
    cogs: "ต้นทุนขาย (COGS)",
    grossProfit: "กำไรขั้นต้น",
    netProfit: "กำไรสุทธิ",
    incomeSource: "📊 ที่มาของรายได้",
    category: "หมวดหมู่",
    salesAmt: "ยอดขาย (฿)",
    expenses: "💸 ต้นทุนและค่าใช้จ่าย",
    expenseItem: "รายการค่าใช้จ่าย",
    amount: "จำนวน (฿)",
    topItems: "🔥 เมนูขายดีที่สุด",
    menu: "เมนู",
    qty: "จำนวน",
    revenue: "รายได้ (฿)"
  },
  en: {
    pageTitle: "💰 Finance & Accounting",
    pageDesc: "View financial statements, cash flow, and cost structure",
    totalRevenue: "Total Revenue",
    cogs: "COGS",
    grossProfit: "Gross Profit",
    netProfit: "Net Profit",
    incomeSource: "📊 Income Sources",
    category: "Category",
    salesAmt: "Sales (฿)",
    expenses: "💸 Costs & Expenses",
    expenseItem: "Expense Item",
    amount: "Amount (฿)",
    topItems: "🔥 Top Selling Items",
    menu: "Menu",
    qty: "Qty",
    revenue: "Revenue (฿)"
  }
};

export default function FinancePage() {
  // 🌐 ระบบแปลภาษา
  const [language, setLanguage] = useState(localStorage.getItem('bizflow_language') || 'th');
  const t = dict[language];

  useEffect(() => {
    const handleLangUpdate = () => setLanguage(localStorage.getItem('bizflow_language') || 'th');
    window.addEventListener('language_updated', handleLangUpdate);
    return () => window.removeEventListener('language_updated', handleLangUpdate);
  }, []);

  const [financeData] = useState({
    revenue: 150000,
    costOfGoods: 45000,
    operatingExpenses: 32000,
    otherExpenses: 18000,
  });

  const [incomeSources] = useState([
    { id: 1, category: language === 'th' ? 'อาหารจานหลัก' : 'Main Dish', amount: 80000 },
    { id: 2, category: language === 'th' ? 'เครื่องดื่ม' : 'Beverages', amount: 45000 },
    { id: 3, category: language === 'th' ? 'ของหวาน / ของทานเล่น' : 'Desserts / Snacks', amount: 25000 },
  ]);

  const [expenseBreakdown] = useState([
    { id: 1, category: language === 'th' ? 'ค่าแรงพนักงาน' : 'Payroll', amount: 18000 },
    { id: 2, category: language === 'th' ? 'ค่าวัตถุดิบ' : 'Ingredients', amount: 24000 },
    { id: 3, category: language === 'th' ? 'ค่าเช่าสถานที่' : 'Rent', amount: 12000 },
    { id: 4, category: language === 'th' ? 'ค่าไฟ/น้ำ' : 'Utilities', amount: 6000 },
  ]);

  const [topItems] = useState([
    { id: 101, name: language === 'th' ? 'ชาเย็น' : 'Thai Tea', qty: 410, revenue: 16400 },
    { id: 102, name: language === 'th' ? 'ผัดไทยกุ้งสด' : 'Pad Thai', qty: 320, revenue: 25600 },
    { id: 103, name: language === 'th' ? 'กะเพราหมูกรอบ' : 'Crispy Pork Basil', qty: 285, revenue: 17100 },
    { id: 104, name: language === 'th' ? 'ชาเฉาก๊วย' : 'Grass Jelly Tea', qty: 230, revenue: 13800 },
  ]);

  const grossProfit = financeData.revenue - financeData.costOfGoods;
  const netProfit = financeData.revenue - financeData.costOfGoods - financeData.operatingExpenses - financeData.otherExpenses;
  const isProfit = netProfit >= 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>{t.pageTitle}</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>{t.pageDesc}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card">
          <div className="kpi-title">{t.totalRevenue}</div>
          <div className="kpi-value mono">฿{financeData.revenue.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="kpi-title">{t.cogs}</div>
          <div className="kpi-value mono" style={{ color: 'var(--loss)' }}>฿{financeData.costOfGoods.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="kpi-title">{t.grossProfit}</div>
          <div className="kpi-value mono" style={{ color: 'var(--profit)' }}>฿{grossProfit.toLocaleString()}</div>
        </div>
        <div className="card" style={{ border: `1px solid ${isProfit ? 'var(--profit)' : 'var(--loss)'}40`, background: isProfit ? 'var(--profit-bg)' : 'var(--loss-bg)' }}>
          <div className="kpi-title" style={{ color: isProfit ? 'var(--profit)' : 'var(--loss)' }}>{t.netProfit}</div>
          <div className="kpi-value mono" style={{ color: isProfit ? 'var(--profit)' : 'var(--loss)' }}>
            {isProfit ? '+' : ''}฿{netProfit.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>{t.incomeSource}</h3>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th>{t.category}</th>
                <th style={{ textAlign: 'right' }}>{t.salesAmt}</th>
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
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>{t.expenses}</h3>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th>{t.expenseItem}</th>
                <th style={{ textAlign: 'right' }}>{t.amount}</th>
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
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>{t.topItems}</h3>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th>{t.menu}</th>
                <th style={{ textAlign: 'center' }}>{t.qty}</th>
                <th style={{ textAlign: 'right' }}>{t.revenue}</th>
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