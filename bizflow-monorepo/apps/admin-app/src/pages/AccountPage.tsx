import React from 'react';

export default function AccountPage() {
  const accounts = [
    { id: 'A01', type: 'เงินสด', balance: 42500, status: 'ปกติ' },
    { id: 'A02', type: 'บัญชีธนาคาร', balance: 128400, status: 'ปกติ' },
    { id: 'A03', type: 'บัญชีลูกหนี้', balance: 18300, status: 'ติดตาม' },
  ];

  const recentTransactions = [
    { id: 1, desc: 'ชำระค่าสินค้า', amount: -15200, date: '12 พ.ค. 2026' },
    { id: 2, desc: 'รับเงินสดจากลูกค้า', amount: 78000, date: '11 พ.ค. 2026' },
    { id: 3, desc: 'จ่ายค่าจ้างพนักงาน', amount: -23800, date: '10 พ.ค. 2026' },
    { id: 4, desc: 'เงินฝากเข้าธนาคาร', amount: 36000, date: '09 พ.ค. 2026' },
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>🧾 บัญชีและการเงิน</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>
            ดูสถานะบัญชี รายการเงินและยอดคงเหลือของช่องทางต่าง ๆ
          </p>
        </div>
        <button className="btn-outline">ดาวน์โหลดบัญชี</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {accounts.map((account) => (
          <div key={account.id} className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>{account.type}</div>
                <div style={{ fontSize: '14px', color: account.status === 'ติดตาม' ? 'var(--warning)' : 'var(--text-main)', fontWeight: 700 }}>{account.status}</div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: account.balance >= 0 ? 'var(--profit)' : 'var(--loss)' }}>฿{account.balance.toLocaleString()}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>รหัสบัญชี</div>
                <div style={{ fontSize: '16px', color: 'var(--text-main)', fontWeight: 700 }}>{account.id}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>สถานะ</div>
                <div style={{ fontSize: '16px', color: 'var(--text-main)', fontWeight: 700 }}>{account.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>รายการเคลื่อนไหวล่าสุด</h3>
        </div>
        <table className="modern-table">
          <thead>
            <tr>
              <th>รายการ</th>
              <th style={{ textAlign: 'center' }}>วันที่</th>
              <th style={{ textAlign: 'right' }}>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ fontWeight: 600 }}>{tx.desc}</td>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{tx.date}</td>
                <td className="mono" style={{ textAlign: 'right', color: tx.amount >= 0 ? 'var(--profit)' : 'var(--loss)', fontWeight: 700 }}>
                  {tx.amount >= 0 ? '+' : '-'}฿{Math.abs(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
