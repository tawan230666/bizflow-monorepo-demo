import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OverviewPage() {
  const navigate = useNavigate();

  // ระบบเวลาแบบ Real-time
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const timeString = currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ระบบ Multi-Branch
  const [branch, setBranch] = useState('bkk');
  const branchData: Record<string, any> = {
    bkk: { name: 'กรุงเทพฯ (HQ)', sales: 12450, orders: 84, customers: 142, profit: 4100, wage: 2850 },
    cnx: { name: 'เชียงใหม่', sales: 8200, orders: 45, customers: 89, profit: 2500, wage: 1800 },
    hkt: { name: 'ภูเก็ต', sales: 15600, orders: 112, customers: 210, profit: 5800, wage: 3200 }
  };
  const currentKPI = branchData[branch];

  return (
    <div className="page-container">
      
      {/* =========================================
          1. HEADER & BRANCH SELECTOR
          ========================================= */}
      <div className="page-header" style={{ marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🧭</span> Command Center
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            ภาพรวมผลประกอบการและสถานะระบบแบบเรียลไทม์
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <select 
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              style={{
                appearance: 'none',
                background: 'var(--bg-surface)', 
                color: 'var(--text-main)', 
                border: '1px solid var(--border-light)', 
                padding: '10px 40px 10px 16px', 
                borderRadius: '10px', 
                fontSize: '14px', 
                fontWeight: 600,
                outline: 'none', 
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <option value="bkk">📍 สาขา: กรุงเทพฯ (HQ)</option>
              <option value="cnx">📍 สาขา: เชียงใหม่</option>
              <option value="hkt">📍 สาขา: ภูเก็ต</option>
            </select>
            <span style={{ position: 'absolute', right: '14px', top: '10px', pointerEvents: 'none', fontSize: '12px', color: 'var(--text-muted)' }}>▼</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--profit-bg)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--profit)', borderRadius: '50%', boxShadow: '0 0 8px var(--profit)' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--profit)', letterSpacing: '0.5px' }}>LIVE • {timeString}</span>
          </div>
        </div>
      </div>

      {/* =========================================
          2. QUICK ACTIONS
          ========================================= */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <button 
          className="quick-action-btn" 
          onClick={() => alert(`🚀 เปิดหน้าจอ: รับออเดอร์ (สาขา ${currentKPI.name})`)}
          style={{ background: 'var(--text-main)', color: 'var(--bg-surface)', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          <span style={{ fontSize: '18px' }}>+</span> เพิ่มออเดอร์ด่วน
        </button>
        
        <button className="quick-action-btn" onClick={() => navigate('/finance')}><span>💸</span> บันทึกรายจ่าย</button>
        <button className="quick-action-btn" onClick={() => navigate('/employee')}><span>👥</span> เพิ่มพนักงาน</button>
        <button className="quick-action-btn" onClick={() => navigate('/report')}><span>📊</span> ดูรายงานวันนี้</button>
        
        <button className="quick-action-btn" style={{ marginLeft: 'auto', borderStyle: 'dashed', borderColor: 'var(--border-light)' }} onClick={() => alert('📥 กำลังดาวน์โหลด PDF...')}>
          <span>📄</span> Export PDF
        </button>
      </div>

      {/* =========================================
          3. KPI METRICS
          ========================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', borderTop: '4px solid var(--text-main)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>ยอดขายวันนี้</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>฿{currentKPI.sales.toLocaleString()}</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>ออเดอร์</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: '#3B82F6', lineHeight: 1 }}>{currentKPI.orders} <span style={{fontSize:'14px', color:'var(--text-muted)', fontWeight: 500}}>บิล</span></div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>ลูกค้า</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: '#F59E0B', lineHeight: 1 }}>{currentKPI.customers} <span style={{fontSize:'14px', color:'var(--text-muted)', fontWeight: 500}}>คน</span></div>
        </div>
        <div className="card" style={{ padding: '20px', background: 'var(--profit-bg)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--profit)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>กำไรคาดการณ์</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--profit)', lineHeight: 1 }}>฿{currentKPI.profit.toLocaleString()}</div>
        </div>
        <div className="card" style={{ padding: '20px', background: 'var(--loss-bg)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <div style={{ fontSize: '13px', color: 'var(--loss)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>ค่าแรง (รวม OT)</div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--loss)', lineHeight: 1 }}>฿{currentKPI.wage.toLocaleString()}</div>
        </div>
      </div>

      {/* =========================================
          4. AI INSIGHTS
          ========================================= */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '20px' }}>✨</span>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Business Intelligence & AI Recommendations</h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Forecast Card */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3B82F6' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>🔮</span>
            <span style={{ fontSize: '11px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>AI FORECAST</span>
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: 'var(--text-main)', fontWeight: 700 }}>คาดการณ์รายได้จบวัน: <span className="mono" style={{ color: '#3B82F6' }}>฿{(currentKPI.sales * 1.2).toLocaleString()}</span></h4>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <strong>Peak Hours:</strong> 12:00-13:00 และ 18:00-20:00<br/>
            <span style={{ color: '#F59E0B', fontWeight: 600 }}>💡 แนะนำ:</span> ควรเพิ่มพนักงานครัว 1 คนช่วง 18:00-20:00 
          </div>
        </div>

        {/* Summary Card */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden', padding: '24px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--profit)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>📊</span>
            <span style={{ fontSize: '11px', background: 'var(--profit-bg)', color: 'var(--profit)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>AUTO SUMMARY</span>
          </div>
          <h4 style={{ margin: '0 0 12px', fontSize: '16px', color: 'var(--text-main)', fontWeight: 700 }}>สรุปผลงานสัปดาห์นี้</h4>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>รายได้:</span> <span className="mono" style={{ color: 'var(--profit)', fontWeight: 700 }}>+13.4%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>ค่าใช้จ่าย:</span> <span className="mono" style={{ color: 'var(--loss)', fontWeight: 700 }}>+5.2%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '8px', marginTop: '4px' }}>
              <strong style={{ color: 'var(--text-main)' }}>กำไรสุทธิ:</strong> <strong className="mono" style={{ color: 'var(--profit)' }}>+8.2%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          5. BOTTOM GRIDS (Alerts, Inventory, Heatmap)
          ========================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Alerts */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: 'var(--text-main)', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--loss)' }}>🚨</span> System Alerts & Warnings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--loss-bg)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid var(--loss)' }}>
                <span style={{ fontSize: '20px' }}>📉</span>
                <div style={{ color: 'var(--loss)', fontSize: '14px', fontWeight: 600 }}>รายจ่าย "ค่าไฟ" สูงผิดปกติ (+20%)</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--warning-bg)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid var(--warning)' }}>
                <span style={{ fontSize: '20px' }}>⏱️</span>
                <div style={{ color: 'var(--warning)', fontSize: '14px', fontWeight: 600, filter: 'brightness(0.8)' }}>พนักงาน E003 มาสายสะสม 4 ครั้ง</div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: 'var(--text-main)', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📦</span> Inventory Warnings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>🥛 นมสด (แกลลอน)</div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--border-light)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>เหลือ 3 แกลลอน</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>🥚 ไข่ไก่ (แผง)</div>
                <div style={{ fontSize: '13px', color: 'var(--warning)', background: 'var(--warning-bg)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>เหลือ 1 แผง (30 ฟอง)</div>
              </div>
            </div>
            <button className="btn-outline" style={{ width: '100%', marginTop: '20px', padding: '10px' }}>
              ตรวจสอบสต็อกทั้งหมด ➔
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Heatmap */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: 'var(--text-main)', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#F59E0B' }}>🔥</span> Busy Days Heatmap
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { day: 'จันทร์', w: '30%', c: '#8B5CF6' },
                { day: 'อังคาร', w: '45%', c: '#8B5CF6' },
                { day: 'พุธ', w: '40%', c: '#8B5CF6' },
                { day: 'พฤหัสฯ', w: '60%', c: '#8B5CF6' },
                { day: 'ศุกร์', w: '90%', c: 'linear-gradient(90deg, #F59E0B, #EF4444)' },
                { day: 'เสาร์', w: '100%', c: 'linear-gradient(90deg, #F59E0B, #EF4444)' },
                { day: 'อาทิตย์', w: '85%', c: 'linear-gradient(90deg, #F59E0B, #EF4444)' },
              ].map(item => (
                <div key={item.day} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '50px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{item.day}</div>
                  <div style={{ flex: 1, height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: item.w, background: item.c, borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#3B82F6' }}>⚡</span> Live Activity Feed
              </h3>
              <span style={{ fontSize: '11px', background: 'var(--profit-bg)', color: 'var(--profit)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>Auto Refreshing...</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              {/* Vertical Line */}
              <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-light)', zIndex: 0 }}></div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--profit-bg)', border: '2px solid var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🍽️</div>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 600 }}>รับออเดอร์ใหม่ #1048 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(สาขา {currentKPI.name})</span></div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>เพิ่งเกิดขึ้น (Just now)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--loss-bg)', border: '2px solid var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📉</div>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 600 }}>สต็อกไข่ไก่ถูกตัด -15 ฟอง</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>2 นาทีที่แล้ว</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-main)', border: '2px solid var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>👤</div>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 600 }}>E002 (สมหญิง) เช็คอินเข้างาน</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>15 นาทีที่แล้ว</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}