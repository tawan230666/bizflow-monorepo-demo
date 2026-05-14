import React, { useState, useEffect } from 'react';

// 🌐 พจนานุกรม
const dict: Record<string, any> = {
  th: {
    title: "🏦 Branch Accounts",
    desc: "จัดการบัญชีและตรวจสอบรายการเดินบัญชีของแต่ละสาขา",
    export: "📥 Export PDF",
    addManual: "+ เพิ่มรายการด้วยตนเอง",
    selectBranch: "เลือกสาขาเพื่อดูบัญชี:",
    balance: "ยอดเงินคงเหลือ (Balance)",
    accNo: "เลขบัญชี:",
    income: "รายรับวันนี้ (Income)",
    expense: "รายจ่ายวันนี้ (Expense)",
    txHistory: "รายการเดินบัญชี (Transaction History)",
    txDesc: "แสดงข้อมูล 30 วันล่าสุด",
    dateTime: "วันที่ / เวลา",
    refCode: "รหัสอ้างอิง",
    detail: "รายละเอียด",
    status: "สถานะ",
    amount: "จำนวนเงิน (฿)",
    noTx: "ไม่มีรายการเดินบัญชีในขณะนี้",
    statusSuccess: "สำเร็จ",
    descIncomeQr: "รับชำระเงินค่าอาหาร (QR PromptPay)",
    descExpenseIngredient: "จ่ายค่าวัตถุดิบ (ตลาดไท)",
    descIncomeCash: "รับชำระเงินค่าอาหาร (เงินสด)",
    descExpenseWage: "โอนเงินเดือนพนักงาน (Part-time)",
    descIncomeCredit: "รับชำระเงินค่าอาหาร (Credit Card)",
    descExpenseUtil: "จ่ายค่าไฟฟ้าย่อย",
    descExpenseRent: "จ่ายค่าเช่าที่จอดรถ",
    descIncomeAli: "รับชำระเงินค่าอาหาร (Alipay)"
  },
  en: {
    title: "🏦 Branch Accounts",
    desc: "Manage accounts and monitor transaction history for each branch",
    export: "📥 Export PDF",
    addManual: "+ Add Manual Entry",
    selectBranch: "Select branch to view account:",
    balance: "Balance",
    accNo: "Account No:",
    income: "Today's Income",
    expense: "Today's Expense",
    txHistory: "Transaction History",
    txDesc: "Showing last 30 days",
    dateTime: "Date / Time",
    refCode: "Ref Code",
    detail: "Description",
    status: "Status",
    amount: "Amount (฿)",
    noTx: "No transactions at the moment",
    statusSuccess: "Success",
    descIncomeQr: "Food payment (QR PromptPay)",
    descExpenseIngredient: "Ingredient purchase (Talaad Thai)",
    descIncomeCash: "Food payment (Cash)",
    descExpenseWage: "Payroll transfer (Part-time)",
    descIncomeCredit: "Food payment (Credit Card)",
    descExpenseUtil: "Utility bill payment",
    descExpenseRent: "Parking rent payment",
    descIncomeAli: "Food payment (Alipay)"
  }
};

const accountSummary: Record<string, any> = {
  bkk: { name: 'กรุงเทพฯ (HQ)', balance: 425000, incomeToday: 12450, expenseToday: 3200, accountNo: '123-4-56789-0' },
  cnx: { name: 'เชียงใหม่', balance: 185000, incomeToday: 8200, expenseToday: 1500, accountNo: '098-7-65432-1' },
  hkt: { name: 'ภูเก็ต', balance: 275000, incomeToday: 15600, expenseToday: 4100, accountNo: '112-2-33445-5' },
};

export default function BranchAccountsPage() {
  const [selectedBranch, setSelectedBranch] = useState('bkk');

  // 🌐 ระบบแปลภาษา
  const [language, setLanguage] = useState(localStorage.getItem('bizflow_language') || 'th');
  const t = dict[language];

  useEffect(() => {
    const handleLangUpdate = () => setLanguage(localStorage.getItem('bizflow_language') || 'th');
    window.addEventListener('language_updated', handleLangUpdate);
    return () => window.removeEventListener('language_updated', handleLangUpdate);
  }, []);

  const transactionsData: Record<string, any[]> = {
    bkk: [
      { id: 'TX-1005', date: language === 'th' ? '13 พ.ค. 2026, 14:30' : '13 May 2026, 14:30', desc: t.descIncomeQr, type: 'income', amount: 850, status: t.statusSuccess },
      { id: 'TX-1004', date: language === 'th' ? '13 พ.ค. 2026, 11:15' : '13 May 2026, 11:15', desc: t.descExpenseIngredient, type: 'expense', amount: 3200, status: t.statusSuccess },
      { id: 'TX-1003', date: language === 'th' ? '13 พ.ค. 2026, 09:00' : '13 May 2026, 09:00', desc: t.descIncomeCash, type: 'income', amount: 1200, status: t.statusSuccess },
      { id: 'TX-1002', date: language === 'th' ? '12 พ.ค. 2026, 18:45' : '12 May 2026, 18:45', desc: t.descExpenseWage, type: 'expense', amount: 4500, status: t.statusSuccess },
      { id: 'TX-1001', date: language === 'th' ? '12 พ.ค. 2026, 12:00' : '12 May 2026, 12:00', desc: t.descIncomeCredit, type: 'income', amount: 3400, status: t.statusSuccess },
    ],
    cnx: [
      { id: 'TX-2003', date: language === 'th' ? '13 พ.ค. 2026, 13:20' : '13 May 2026, 13:20', desc: t.descIncomeQr, type: 'income', amount: 450, status: t.statusSuccess },
      { id: 'TX-2002', date: language === 'th' ? '13 พ.ค. 2026, 10:00' : '13 May 2026, 10:00', desc: t.descExpenseUtil, type: 'expense', amount: 1500, status: t.statusSuccess },
      { id: 'TX-2001', date: language === 'th' ? '12 พ.ค. 2026, 15:30' : '12 May 2026, 15:30', desc: t.descIncomeCash, type: 'income', amount: 2100, status: t.statusSuccess },
    ],
    hkt: [
      { id: 'TX-3004', date: language === 'th' ? '13 พ.ค. 2026, 15:00' : '13 May 2026, 15:00', desc: t.descIncomeCredit, type: 'income', amount: 4200, status: t.statusSuccess },
      { id: 'TX-3003', date: language === 'th' ? '13 พ.ค. 2026, 09:30' : '13 May 2026, 09:30', desc: t.descExpenseRent, type: 'expense', amount: 4100, status: t.statusSuccess },
      { id: 'TX-3002', date: language === 'th' ? '12 พ.ค. 2026, 20:15' : '12 May 2026, 20:15', desc: t.descIncomeQr, type: 'income', amount: 3100, status: t.statusSuccess },
      { id: 'TX-3001', date: language === 'th' ? '12 พ.ค. 2026, 11:00' : '12 May 2026, 11:00', desc: t.descIncomeAli, type: 'income', amount: 1800, status: t.statusSuccess },
    ]
  };

  const currentSummary = accountSummary[selectedBranch];
  const currentTransactions = transactionsData[selectedBranch];

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', animation: 'pageEnter 0.5s ease-out forwards' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🏦</span> {t.title}
          </h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>
            {t.desc}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline">{t.export}</button>
          <button className="quick-action-btn primary">{t.addManual}</button>
        </div>
      </div>

      {/* BRANCH SELECTOR (TAB) */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>{t.selectBranch}</span>
        <div className="segmented-control">
          {Object.keys(accountSummary).map((key) => (
            <button 
              key={key}
              className={`segmented-btn ${selectedBranch === key ? 'active' : ''}`} 
              onClick={() => setSelectedBranch(key)}
            >
              📍 {language === 'th' ? accountSummary[key].name : (key === 'bkk' ? 'Bangkok (HQ)' : key === 'cnx' ? 'Chiang Mai' : 'Phuket')}
            </button>
          ))}
        </div>
      </div>

      {/* ACCOUNT SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, var(--bg-card) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>{t.balance}</div>
          <div className="mono" style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-main)' }}>฿{currentSummary.balance.toLocaleString()}</div>
          <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {t.accNo} <span className="mono" style={{ color: 'var(--text-main)', fontWeight: 600 }}>{currentSummary.accountNo}</span>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>{t.income}</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--profit)' }}>+ ฿{currentSummary.incomeToday.toLocaleString()}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>{t.expense}</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--loss)' }}>- ฿{currentSummary.expenseToday.toLocaleString()}</div>
        </div>
      </div>

      {/* TRANSACTION HISTORY TABLE */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>{t.txHistory}</h3>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.txDesc}</div>
        </div>
        
        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: '150px' }}>{t.dateTime}</th>
              <th style={{ width: '100px' }}>{t.refCode}</th>
              <th>{t.detail}</th>
              <th style={{ textAlign: 'center' }}>{t.status}</th>
              <th style={{ textAlign: 'right' }}>{t.amount}</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{tx.date}</td>
                <td className="mono" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{tx.id}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tx.desc}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: 'var(--profit-bg)', color: 'var(--profit)' }}>
                    {tx.status}
                  </span>
                </td>
                <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: tx.type === 'income' ? 'var(--profit)' : 'var(--loss)' }}>
                  {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {currentTransactions.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {t.noTx}
          </div>
        )}
      </div>

    </div>
  );
}