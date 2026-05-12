import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OverviewPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [branch, setBranch] = useState('bkk');

  const branchData: Record<string, any> = {
    bkk: { name: 'กรุงเทพฯ (HQ)', sales: 12450, orders: 84, customers: 142, profit: 4100, wage: 2850 },
    cnx: { name: 'เชียงใหม่', sales: 8200, orders: 45, customers: 89, profit: 2500, wage: 1800 },
    hkt: { name: 'ภูเก็ต', sales: 15600, orders: 112, customers: 210, profit: 5800, wage: 3200 }
  };
  const currentKPI = branchData[branch];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className="page-container" style={{ maxWidth: '1440px', margin: '0 auto', animation: 'pageEnter 0.5s ease-out forwards' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            margin: 0,
            background: 'linear-gradient(90deg, var(--text-main), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', margin: 0 }}>
            ภาพรวมธุรกิจแบบเรียลไทม์ • {currentKPI.name}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: '9999px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            <option value="bkk">📍 กรุงเทพฯ (HQ)</option>
            <option value="cnx">📍 เชียงใหม่</option>
            <option value="hkt">📍 ภูเก็ต</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--profit)', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '14px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.3)', animation: 'pulse 2s infinite' }}></div>
            LIVE • {timeString}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        
        <div className="card" style={{ background: 'var(--bg-card)', borderTop: '3px solid #6366f1' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>ยอดขายวันนี้</div>
          <div className="mono" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>฿{currentKPI.sales.toLocaleString()}</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--profit)' }}>↑ 12.4%</div>
        </div>

        <div className="card" style={{ background: 'var(--bg-card)', borderTop: '3px solid #3b82f6' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>ออเดอร์</div>
          <div className="mono" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>{currentKPI.orders} <span style={{fontSize:'16px'}}>บิล</span></div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--profit)' }}>↑ 8%</div>
        </div>

        <div className="card" style={{ background: 'var(--bg-card)', borderTop: '3px solid #eab308' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>ลูกค้าใหม่</div>
          <div className="mono" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>{currentKPI.customers} <span style={{fontSize:'16px'}}>คน</span></div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>→ Stable</div>
        </div>

        <div className="card" style={{ background: 'var(--bg-card)', borderTop: '3px solid #22c55e' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>กำไรสุทธิ</div>
          <div className="mono" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px', color: 'var(--profit)' }}>฿{currentKPI.profit.toLocaleString()}</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--profit)' }}>↑ 18.7%</div>
        </div>

      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
        <button className="quick-action-btn primary" onClick={() => alert('เปิดระบบรับออเดอร์')}>
          <span style={{ fontSize: '16px' }}>+</span> รับออเดอร์ด่วน
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/finance')}>
          <span>💰</span> บันทึกรายจ่าย
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/report')}>
          <span>📊</span> ดูรายงาน
        </button>
      </div>

    </div>
  );
}