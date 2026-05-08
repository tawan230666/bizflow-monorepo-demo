import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่มตัวนำทาง

export default function OverviewPage() {
  const navigate = useNavigate(); // สร้างตัวแปรสำหรับเปลี่ยนหน้า

  // 1. ระบบเวลาแบบ Real-time
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // 2. ระบบ Multi-Branch (จัดการสาขา)
  const [branch, setBranch] = useState('bkk');

  // ข้อมูล KPI จำลองที่แยกตามสาขา (เวลากดเปลี่ยนสาขา ตัวเลขพวกนี้จะเปลี่ยนตาม)
  const branchData: Record<string, any> = {
    bkk: { name: 'กรุงเทพฯ (HQ)', sales: 12450, orders: 84, customers: 142, profit: 4100, wage: 2850 },
    cnx: { name: 'เชียงใหม่', sales: 8200, orders: 45, customers: 89, profit: 2500, wage: 1800 },
    hkt: { name: 'ภูเก็ต', sales: 15600, orders: 112, customers: 210, profit: 5800, wage: 3200 }
  };
  
  const currentKPI = branchData[branch];

  return (
    <div className="page-container">
      
      {/* =========================================
          HEADER: Multi-Branch & Live Status
          ========================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0 }}>🧭 Command Center</h2>
          
          {/* Dropdown เปลี่ยนสาขาที่ทำงานได้จริงแล้ว */}
          <select 
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            style={{
              background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)', 
              padding: '6px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <option value="bkk">สาขา: กรุงเทพฯ (HQ)</option>
            <option value="cnx">สาขา: เชียงใหม่</option>
            <option value="hkt">สาขา: ภูเก็ต</option>
          </select>
        </div>

        {/* Live Indicator */}
        <div className="live-indicator">
          <div className="pulse-dot"></div>
          <span>LIVE • {timeString}</span>
        </div>
      </div>

      {/* =========================================
          QUICK ACTIONS (ปุ่มกดทำงานได้แล้ว)
          ========================================= */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {/* หน้าที่ยังไม่ได้สร้าง ให้แจ้งเตือนไปก่อน */}
        <button className="quick-action-btn primary" onClick={() => alert(`🚀 เปิดหน้าจอ: รับออเดอร์ (สาขา ${currentKPI.name})`)}>
          ➕ เพิ่มออเดอร์ด่วน
        </button>
        
        {/* หน้าที่สร้างแล้ว ให้เด้งเปลี่ยนหน้าทันที */}
        <button className="quick-action-btn" onClick={() => navigate('/finance')}>💸 บันทึกรายจ่าย</button>
        <button className="quick-action-btn" onClick={() => navigate('/employee')}>👥 เพิ่มพนักงาน</button>
        <button className="quick-action-btn" onClick={() => navigate('/report')}>📊 ดูรายงานวันนี้</button>
        
        {/* จำลองการโหลดไฟล์ PDF */}
        <button className="quick-action-btn" style={{ borderColor: '#ec4899', color: '#ec4899' }} onClick={() => alert('📥 กำลังประมวลผลและดาวน์โหลดไฟล์ PDF...')}>
          📄 Export PDF
        </button>
      </div>

      {/* =========================================
          KPI TODAY (ตัวเลขเปลี่ยนตามสาขา)
          ========================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>ยอดขายวันนี้</div>
          <div className="amount" style={{ fontSize: '24px', color: 'var(--text-main)' }}>฿{currentKPI.sales.toLocaleString()}</div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>ออเดอร์</div>
          <div className="amount" style={{ fontSize: '24px', color: '#3B82F6' }}>{currentKPI.orders} <span style={{fontSize:'12px', color:'var(--text-muted)'}}>บิล</span></div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>ลูกค้า</div>
          <div className="amount" style={{ fontSize: '24px', color: '#FCD34D' }}>{currentKPI.customers} <span style={{fontSize:'12px', color:'var(--text-muted)'}}>คน</span></div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>กำไรคาดการณ์</div>
          <div className="amount" style={{ fontSize: '24px', color: 'var(--profit)' }}>฿{currentKPI.profit.toLocaleString()}</div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>ค่าแรง (รวม OT)</div>
          <div className="amount" style={{ fontSize: '24px', color: 'var(--loss)' }}>฿{currentKPI.wage.toLocaleString()}</div>
        </div>
      </div>

      {/* =========================================
          AI INSIGHTS & FORECAST
          ========================================= */}
      <h3 style={{ fontSize: '15px', color: '#FCD34D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ✨ Business Intelligence & AI Recommendations
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="card" style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔮</span>
            <span style={{ fontSize: '12px', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>AI Forecast</span>
          </div>
          <h4 style={{ margin: '0 0 8px', color: 'var(--text-main)' }}>คาดการณ์รายได้จบวัน: ฿{(currentKPI.sales * 1.2).toLocaleString()}</h4>
          <div style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            <strong>Peak Hours:</strong> 12:00-13:00 และ 18:00-20:00<br/>
            <span style={{ color: '#FCD34D' }}>💡 แนะนำ:</span> ควรเพิ่มพนักงานครัว 1 คนช่วง 18:00-20:00 
          </div>
        </div>

        <div className="card" style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <span style={{ fontSize: '12px', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>Auto Summary</span>
          </div>
          <h4 style={{ margin: '0 0 8px', color: 'var(--text-main)' }}>สรุปผลงานสัปดาห์นี้</h4>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>รายได้:</span> <span style={{ color: 'var(--profit)' }}>+13.4%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>ค่าใช้จ่าย:</span> <span style={{ color: 'var(--loss)' }}>+5.2%</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '4px', marginTop: '2px' }}>
              <strong>กำไรสุทธิ:</strong> <strong style={{ color: 'var(--profit)' }}>+8.2%</strong>
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* =========================================
            ALERTS & INVENTORY (Left Column)
            ========================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: 'var(--loss)' }}>🚨 System Alerts & Warnings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--loss)' }}>
                <span style={{ fontSize: '18px' }}>📉</span>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: '13px', fontWeight: 600 }}>รายจ่าย "ค่าไฟ" สูงผิดปกติ (+20%)</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <span style={{ fontSize: '18px' }}>⏱️</span>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: '13px', fontWeight: 600 }}>พนักงาน E003 มาสายสะสม 4 ครั้ง</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: '#FCD34D' }}>📦 Inventory Warnings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px dashed var(--border-light)' }}>
                <div style={{ fontSize: '14px' }}>🥛 นมสด (แกลลอน)</div>
                <div style={{ fontSize: '13px', color: 'var(--loss)', fontWeight: 600 }}>เหลือ 3 แกลลอน</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px dashed var(--border-light)' }}>
                <div style={{ fontSize: '14px' }}>🥚 ไข่ไก่ (แผง)</div>
                <div style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 600 }}>เหลือ 1 แผง (30 ฟอง)</div>
              </div>
            </div>
            <button style={{ width: '100%', marginTop: '16px', padding: '8px', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
              ตรวจสอบสต็อกทั้งหมด ➔
            </button>
          </div>

        </div>

        {/* =========================================
            HEATMAP & ACTIVITY FEED (Right Column)
            ========================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: 'var(--text-main)' }}>🔥 Busy Days Heatmap</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="heatmap-row"><div className="heatmap-label">จันทร์</div><div className="heatmap-bar-bg"><div className="heatmap-bar-fill" style={{ width: '30%' }}></div></div></div>
              <div className="heatmap-row"><div className="heatmap-label">อังคาร</div><div className="heatmap-bar-bg"><div className="heatmap-bar-fill" style={{ width: '45%' }}></div></div></div>
              <div className="heatmap-row"><div className="heatmap-label">พุธ</div><div className="heatmap-bar-bg"><div className="heatmap-bar-fill" style={{ width: '40%' }}></div></div></div>
              <div className="heatmap-row"><div className="heatmap-label">พฤหัสฯ</div><div className="heatmap-bar-bg"><div className="heatmap-bar-fill" style={{ width: '60%' }}></div></div></div>
              <div className="heatmap-row"><div className="heatmap-label">ศุกร์</div><div className="heatmap-bar-bg"><div className="heatmap-bar-fill" style={{ width: '90%', background: 'linear-gradient(90deg, #F59E0B, #ef4444)' }}></div></div></div>
              <div className="heatmap-row"><div className="heatmap-label">เสาร์</div><div className="heatmap-bar-bg"><div className="heatmap-bar-fill" style={{ width: '100%', background: 'linear-gradient(90deg, #F59E0B, #ef4444)' }}></div></div></div>
              <div className="heatmap-row"><div className="heatmap-label">อาทิตย์</div><div className="heatmap-bar-bg"><div className="heatmap-bar-fill" style={{ width: '85%', background: 'linear-gradient(90deg, #F59E0B, #ef4444)' }}></div></div></div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)' }}>⚡ Live Activity Feed</h3>
              <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--profit)', padding: '2px 6px', borderRadius: '4px' }}>Auto Refreshing...</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-light)', zIndex: 0 }}></div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--profit)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>🍽️</div>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: '13px' }}>รับออเดอร์ใหม่ #1048 (สาขา {currentKPI.name})</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>เพิ่งเกิดขึ้น (Just now)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--loss)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>📉</div>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: '13px' }}>สต็อกไข่ไก่ถูกตัด -15 ฟอง</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>2 นาทีที่แล้ว</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>👤</div>
                <div>
                  <div style={{ color: 'var(--text-main)', fontSize: '13px' }}>E002 (สมหญิง) เช็คอินเข้างาน</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>15 นาทีที่แล้ว</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}