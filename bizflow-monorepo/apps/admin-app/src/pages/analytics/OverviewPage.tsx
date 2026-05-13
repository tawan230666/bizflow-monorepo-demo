import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OverviewPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [branch, setBranch] = useState('bkk');

  const branchData: Record<string, any> = {
    bkk: {
      name: 'กรุงเทพฯ (HQ)',
      sales: 12450,
      orders: 84,
      customers: 142,
      customerTraffic: 180,
      newCustomers: 68,
      returningCustomers: 112,
      profit: 4100,
      wage: 2850,
      costOfGoods: 5500,
      topMarginItem: 'ชาเฉาก๊วย',
    },
    cnx: {
      name: 'เชียงใหม่',
      sales: 8200,
      orders: 45,
      customers: 89,
      customerTraffic: 132,
      newCustomers: 50,
      returningCustomers: 82,
      profit: 2500,
      wage: 1800,
      costOfGoods: 3900,
      topMarginItem: 'ชาเฉาก๊วย',
    },
    hkt: {
      name: 'ภูเก็ต',
      sales: 15600,
      orders: 112,
      customers: 210,
      customerTraffic: 290,
      newCustomers: 118,
      returningCustomers: 172,
      profit: 5800,
      wage: 3200,
      costOfGoods: 6600,
      topMarginItem: 'ชาเย็น',
    },
  };

  const branchPerformance = Object.entries(branchData)
    .map(([key, value]) => ({ id: key, ...value }))
    .sort((a, b) => b.sales - a.sales);

  const currentKPI = branchData[branch];
  const averageOrderValue = currentKPI.orders ? currentKPI.sales / currentKPI.orders : 0;
  const newPercent = Math.round((currentKPI.newCustomers / currentKPI.customerTraffic) * 100);
  const returningPercent = 100 - newPercent;
  const laborPercent = Math.round((currentKPI.wage / currentKPI.sales) * 100);
  const cogsPercent = Math.round((currentKPI.costOfGoods / currentKPI.sales) * 100);
  const netMarginPercent = Math.round((currentKPI.profit / currentKPI.sales) * 100);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className="page-container" style={{ maxWidth: '1440px', margin: '0 auto', animation: 'pageEnter 0.5s ease-out forwards', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      
      {/* 🚀 CSS พิเศษสำหรับหน้านี้ เพื่อทำ Scroll แนวนอนแบบ Apple & เอฟเฟกต์การ์ด */}
      <style>{`
        .apple-scroll::-webkit-scrollbar { display: none; }
        .apple-scroll { -ms-overflow-style: none; scrollbar-width: none; scroll-behavior: smooth; }
        .apple-card { 
          background: var(--bg-card); 
          border: 1px solid var(--border-light); 
          border-radius: 28px; /* ขอบมนแบบ Apple */
          padding: 32px; 
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .apple-card:hover { 
          transform: scale(1.02) translateY(-4px); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
      `}</style>

      {/* HEADER SECTION (ปรับให้ดูคลีนขึ้น) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          Command Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', margin: '0 0 24px', maxWidth: '600px' }}>
          ภาพรวมระดับผู้บริหาร ยอดสาขา ต้นทุน และกลยุทธ์ที่ต้องลงมือวันนี้
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '8px', borderRadius: '999px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            style={{ padding: '10px 24px', borderRadius: '999px', background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', outline: 'none', fontSize: '15px' }}
          >
            <option value="bkk">📍 กรุงเทพฯ (HQ)</option>
            <option value="cnx">📍 เชียงใหม่</option>
            <option value="hkt">📍 ภูเก็ต</option>
          </select>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--profit)', padding: '0 16px', fontWeight: 700, fontSize: '14px' }}>
            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)' }}></div>
            LIVE • {timeString}
          </div>
        </div>
      </div>

      {/* 🚀 NEW: TOP KPI CARDS (Horizontal Scroll แบบเว็บ Apple) */}
      <div className="apple-scroll" style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '20px' }}>
        <div className="apple-card" style={{ minWidth: '280px', flex: '0 0 auto', borderTop: '4px solid #6366f1' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>ยอดขายสาขา</div>
          <div className="mono" style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-1px' }}>฿{currentKPI.sales.toLocaleString()}</div>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>รายได้รวมวันนี้</p>
        </div>

        <div className="apple-card" style={{ minWidth: '280px', flex: '0 0 auto', borderTop: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Customer Reach</div>
          <div className="mono" style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-1px' }}>{currentKPI.customerTraffic}</div>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>ลูกค้าที่เข้าร้าน</p>
        </div>

        <div className="apple-card" style={{ minWidth: '280px', flex: '0 0 auto', borderTop: '4px solid #eab308' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Orders</div>
          <div className="mono" style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-1px' }}>{currentKPI.orders}</div>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>ออเดอร์ที่สั่งสำเร็จ</p>
        </div>

        <div className="apple-card" style={{ minWidth: '280px', flex: '0 0 auto', borderTop: '4px solid #22c55e', background: 'linear-gradient(145deg, var(--bg-card), rgba(34, 197, 94, 0.05))' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--profit)', textTransform: 'uppercase', marginBottom: '12px' }}>Net Margin</div>
          <div className="mono" style={{ fontSize: '38px', fontWeight: 800, color: 'var(--profit)', letterSpacing: '-1px' }}>฿{currentKPI.profit.toLocaleString()}</div>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>กำไรหลังหักต้นทุน</p>
        </div>
      </div>

      {/* COMPANY GOALS (สไตล์ Apple คลีนๆ) */}
      <div className="apple-card" style={{ marginBottom: '40px', padding: '40px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, var(--bg-card) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px' }}>🎯</span>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>Q2 / 2026 Target</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>เป้าหมายยอดขายรวมทุกสาขาประจำไตรมาสที่ 2</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Progress</div>
            <div className="mono" style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>85%</div>
          </div>
        </div>

        {/* Progress Bar (หนาขึ้น มนขึ้น แบบ Apple UI) */}
        <div style={{ width: '100%', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
          <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '999px', transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '15px', fontWeight: 600 }}>
          <span className="mono" style={{ color: 'var(--text-main)' }}>฿8,500,000 (Actual)</span>
          <span className="mono" style={{ color: 'var(--text-muted)' }}>฿10,000,000 (Goal)</span>
        </div>
      </div>

      {/* STRATEGIC METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="apple-card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>💸</span> Cash & Runway
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Burn Rate</div>
              <div className="mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--loss)', marginTop: '4px' }}>฿250k</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Runway</div>
              <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--profit)', marginTop: '4px' }}>14.5 Mos</div>
            </div>
          </div>
        </div>

        <div className="apple-card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🧲</span> CAC vs LTV
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CAC</div>
              <div className="mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>฿120</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>LTV</div>
              <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--profit)', marginTop: '4px' }}>฿1,500</div>
            </div>
          </div>
        </div>

        <div className="apple-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, var(--bg-card) 100%)' }}>
          <div style={{ fontSize: '13px', color: 'var(--loss)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🚨</span> Fraud Prevention
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cancel Rate</div>
              <div className="mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>1.2%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Discount Abuse</div>
              <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>0.5%</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '24px', marginBottom: '40px' }}>
        <div className="apple-card" style={{ padding: '40px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800 }}>📊 Multi-Branch Performance</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>อันดับสาขา Top 3 และ Bottom</p>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {branchPerformance.map((branchSummary, index) => (
              <div key={branchSummary.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: '20px', background: index < 3 ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 68, 68, 0.08)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: index < 3 ? 'var(--text-main)' : 'var(--loss)' }}>{index < 3 ? `Top ${index + 1}` : 'Bottom'}</div>
                  <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px' }}>{branchSummary.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: '20px', fontWeight: 800 }}>฿{branchSummary.sales.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <div className="apple-card" style={{ padding: '32px' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 800 }}>🍩 Cost Breakdown</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(var(--loss) 0 ${(cogsPercent / 100) * 360}deg, var(--warning) ${(cogsPercent / 100) * 360}deg ${((cogsPercent + laborPercent) / 100) * 360}deg, var(--profit) ${((cogsPercent + laborPercent) / 100) * 360}deg 360deg)`, display: 'grid', placeItems: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-card)', display: 'grid', placeItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800 }}>{netMarginPercent}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Margin</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}><span style={{ color: 'var(--loss)' }}>● COGS</span> <span>{cogsPercent}%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}><span style={{ color: 'var(--warning)' }}>● Labor</span> <span>{laborPercent}%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}><span style={{ color: 'var(--profit)' }}>● Net Margin</span> <span>{netMarginPercent}%</span></div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}