import React, { useState } from 'react';

// ข้อมูลจำลองสำหรับสรุปยอดบัญชีแต่ละสาขา
const accountSummary: Record<string, any> = {
  bkk: { name: 'กรุงเทพฯ (HQ)', balance: 425000, incomeToday: 12450, expenseToday: 3200, accountNo: '123-4-56789-0' },
  cnx: { name: 'เชียงใหม่', balance: 185000, incomeToday: 8200, expenseToday: 1500, accountNo: '098-7-65432-1' },
  hkt: { name: 'ภูเก็ต', balance: 275000, incomeToday: 15600, expenseToday: 4100, accountNo: '112-2-33445-5' },
};

// ข้อมูลจำลองรายการเดินบัญชี (Statement) แยกตามสาขา
const transactionsData: Record<string, any[]> = {
  bkk: [
    { id: 'TX-1005', date: '13 พ.ค. 2026, 14:30', desc: 'รับชำระเงินค่าอาหาร (QR PromptPay)', type: 'income', amount: 850, status: 'สำเร็จ' },
    { id: 'TX-1004', date: '13 พ.ค. 2026, 11:15', desc: 'จ่ายค่าวัตถุดิบ (ตลาดไท)', type: 'expense', amount: 3200, status: 'สำเร็จ' },
    { id: 'TX-1003', date: '13 พ.ค. 2026, 09:00', desc: 'รับชำระเงินค่าอาหาร (เงินสด)', type: 'income', amount: 1200, status: 'สำเร็จ' },
    { id: 'TX-1002', date: '12 พ.ค. 2026, 18:45', desc: 'โอนเงินเดือนพนักงาน (Part-time)', type: 'expense', amount: 4500, status: 'สำเร็จ' },
    { id: 'TX-1001', date: '12 พ.ค. 2026, 12:00', desc: 'รับชำระเงินค่าอาหาร (Credit Card)', type: 'income', amount: 3400, status: 'สำเร็จ' },
  ],
  cnx: [
    { id: 'TX-2003', date: '13 พ.ค. 2026, 13:20', desc: 'รับชำระเงินค่าอาหาร (QR PromptPay)', type: 'income', amount: 450, status: 'สำเร็จ' },
    { id: 'TX-2002', date: '13 พ.ค. 2026, 10:00', desc: 'จ่ายค่าไฟฟ้าย่อย', type: 'expense', amount: 1500, status: 'สำเร็จ' },
    { id: 'TX-2001', date: '12 พ.ค. 2026, 15:30', desc: 'รับชำระเงินค่าอาหาร (เงินสด)', type: 'income', amount: 2100, status: 'สำเร็จ' },
  ],
  hkt: [
    { id: 'TX-3004', date: '13 พ.ค. 2026, 15:00', desc: 'รับชำระเงินค่าอาหาร (Credit Card)', type: 'income', amount: 4200, status: 'สำเร็จ' },
    { id: 'TX-3003', date: '13 พ.ค. 2026, 09:30', desc: 'จ่ายค่าเช่าที่จอดรถ', type: 'expense', amount: 4100, status: 'สำเร็จ' },
    { id: 'TX-3002', date: '12 พ.ค. 2026, 20:15', desc: 'รับชำระเงินค่าอาหาร (QR PromptPay)', type: 'income', amount: 3100, status: 'สำเร็จ' },
    { id: 'TX-3001', date: '12 พ.ค. 2026, 11:00', desc: 'รับชำระเงินค่าอาหาร (Alipay)', type: 'income', amount: 1800, status: 'สำเร็จ' },
  ]
};

export default function BranchAccountsPage() {
  const [selectedBranch, setSelectedBranch] = useState('bkk');

  const currentSummary = accountSummary[selectedBranch];
  const currentTransactions = transactionsData[selectedBranch];

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', animation: 'pageEnter 0.5s ease-out forwards' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🏦</span> Branch Accounts
          </h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>
            จัดการบัญชีและตรวจสอบรายการเดินบัญชีของแต่ละสาขา
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline">📥 Export PDF</button>
          <button className="quick-action-btn primary">+ เพิ่มรายการด้วยตนเอง</button>
        </div>
      </div>

      {/* BRANCH SELECTOR (TAB) */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>เลือกสาขาเพื่อดูบัญชี:</span>
        <div className="segmented-control">
          {Object.keys(accountSummary).map((key) => (
            <button 
              key={key}
              className={`segmented-btn ${selectedBranch === key ? 'active' : ''}`} 
              onClick={() => setSelectedBranch(key)}
            >
              📍 {accountSummary[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* ACCOUNT SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, var(--bg-card) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>ยอดเงินคงเหลือ (Balance)</div>
          <div className="mono" style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-main)' }}>฿{currentSummary.balance.toLocaleString()}</div>
          <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
            เลขบัญชี: <span className="mono" style={{ color: 'var(--text-main)', fontWeight: 600 }}>{currentSummary.accountNo}</span>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>รายรับวันนี้ (Income)</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--profit)' }}>+ ฿{currentSummary.incomeToday.toLocaleString()}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>รายจ่ายวันนี้ (Expense)</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--loss)' }}>- ฿{currentSummary.expenseToday.toLocaleString()}</div>
        </div>
      </div>

      {/* TRANSACTION HISTORY TABLE */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>รายการเดินบัญชี (Transaction History)</h3>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>แสดงข้อมูล 30 วันล่าสุด</div>
        </div>
        
        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: '150px' }}>วันที่ / เวลา</th>
              <th style={{ width: '100px' }}>รหัสอ้างอิง</th>
              <th>รายละเอียด</th>
              <th style={{ textAlign: 'center' }}>สถานะ</th>
              <th style={{ textAlign: 'right' }}>จำนวนเงิน (฿)</th>
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
            ไม่มีรายการเดินบัญชีในขณะนี้
          </div>
        )}
      </div>

    </div>
  );
}