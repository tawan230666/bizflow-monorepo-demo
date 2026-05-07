import React, { useState } from 'react';

type EmployeeStatus = 'working' | 'available' | 'resting' | 'absent';

interface Employee {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
}

const mockEmployees: Employee[] = [
  { id: 'E001', name: 'สมชาย รักดี', role: 'แคชเชียร์', status: 'working' },
  { id: 'E002', name: 'สมหญิง ขยันยิ่ง', role: 'พนักงานจัดสต๊อก', status: 'available' },
  { id: 'E003', name: 'วิชัย ใจสู้', role: 'ผู้จัดการสาขา', status: 'resting' },
  { id: 'E004', name: 'มาลี สวยงาม', role: 'พนักงานเสิร์ฟ', status: 'working' },
  { id: 'E005', name: 'ธนา พาทำ', role: 'พนักงานทำความสะอาด', status: 'available' },
  { id: 'E006', name: 'วารี ศรีสม', role: 'แคชเชียร์', status: 'resting' },
  { id: 'E007', name: 'กิตติ ใจดี', role: 'พนักงานเสิร์ฟ', status: 'absent' },
  { id: 'E008', name: 'ฟ้าใส ชื่นใจ', role: 'พนักงานจัดสต๊อก', status: 'absent' },
];

// อัปเดต Config: เพิ่มตัวละคร (Emoji) และ Class แอนิเมชันให้แต่ละสถานะ
const statusConfig = {
  working: { label: 'กำลังทำงาน', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', character: '👨‍💻', animClass: 'anim-working' },
  available: { label: 'ว่างงาน', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', character: '🎮', animClass: 'anim-playing' },
  resting: { label: 'กำลังพัก', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', character: '😴', animClass: 'anim-resting' },
  absent: { label: 'ไม่มา', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', character: '🚶‍♂️🪧', animClass: 'anim-absent' },
};

export default function EmployeePage() {
  const [filter, setFilter] = useState<EmployeeStatus | 'all'>('all');

  const filteredEmployees = mockEmployees.filter(emp => 
    filter === 'all' ? true : emp.status === filter
  );

  const getCount = (status: EmployeeStatus | 'all') => {
    if (status === 'all') return mockEmployees.length;
    return mockEmployees.filter(emp => emp.status === status).length;
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0 }}>👥 จัดการบุคลากร (Employee Roster)</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', background: '#11151F', padding: '8px', borderRadius: '12px', border: '1px solid var(--border-light)', width: 'fit-content' }}>
        <button className="filter-btn" onClick={() => setFilter('all')} style={{ background: filter === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent', color: filter === 'all' ? '#F3F4F6' : '#9CA3AF', border: '1px solid transparent', fontWeight: filter === 'all' ? 600 : 500 }}>
          ทั้งหมด ({getCount('all')})
        </button>
        <button className="filter-btn" onClick={() => setFilter('working')} style={{ background: filter === 'working' ? statusConfig.working.bg : 'transparent', color: filter === 'working' ? statusConfig.working.color : '#9CA3AF', border: filter === 'working' ? `1px solid ${statusConfig.working.color}50` : '1px solid transparent', fontWeight: filter === 'working' ? 600 : 500 }}>
          🟢 กำลังทำงาน ({getCount('working')})
        </button>
        <button className="filter-btn" onClick={() => setFilter('available')} style={{ background: filter === 'available' ? statusConfig.available.bg : 'transparent', color: filter === 'available' ? statusConfig.available.color : '#9CA3AF', border: filter === 'available' ? `1px solid ${statusConfig.available.color}50` : '1px solid transparent', fontWeight: filter === 'available' ? 600 : 500 }}>
          🔵 ว่างงาน ({getCount('available')})
        </button>
        <button className="filter-btn" onClick={() => setFilter('resting')} style={{ background: filter === 'resting' ? statusConfig.resting.bg : 'transparent', color: filter === 'resting' ? statusConfig.resting.color : '#9CA3AF', border: filter === 'resting' ? `1px solid ${statusConfig.resting.color}50` : '1px solid transparent', fontWeight: filter === 'resting' ? 600 : 500 }}>
          🟡 กำลังพัก ({getCount('resting')})
        </button>
        <button className="filter-btn" onClick={() => setFilter('absent')} style={{ background: filter === 'absent' ? statusConfig.absent.bg : 'transparent', color: filter === 'absent' ? statusConfig.absent.color : '#9CA3AF', border: filter === 'absent' ? `1px solid ${statusConfig.absent.color}50` : '1px solid transparent', fontWeight: filter === 'absent' ? 600 : 500 }}>
          🔴 ไม่มา ({getCount('absent')})
        </button>
      </div>
      
      {filteredEmployees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>📭</span>
          ไม่มีพนักงานในสถานะนี้
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredEmployees.map((emp) => {
            const statusStyle = statusConfig[emp.status];
            // ใส่คลาสพิเศษให้คนพักงาน เพื่อให้การ์ดสั่นตอน Hover
            const cardExtraClass = emp.status === 'resting' ? 'resting-card' : '';
            
            return (
              <div key={emp.id} className={`card ${cardExtraClass}`} style={{ display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: statusStyle.color, boxShadow: `0 0 10px ${statusStyle.color}` }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  
                  {/* ข้อมูลพนักงาน */}
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'JetBrains Mono', marginBottom: '6px' }}>
                      ID: {emp.id}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', textTransform: 'none' }}>
                      {emp.name}
                    </h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
                      {emp.role}
                    </div>
                    
                    {/* ป้ายสถานะ ย้ายมาอยู่ใต้ชื่อ */}
                    <div style={{ marginTop: '12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: statusStyle.color, backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.color}40`, display: 'inline-flex', alignItems: 'center' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusStyle.color, marginRight: '6px', boxShadow: `0 0 5px ${statusStyle.color}` }}></span>
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* ตัวละคร Avatar ขยับได้ */}
                  <div className="avatar-container" style={{ border: `2px solid ${statusStyle.color}80` }}>
                    <div className={statusStyle.animClass}>
                      {statusStyle.character}
                    </div>
                  </div>

                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                  <button className="filter-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '14px' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                  >
                    📝 ดูประวัติ
                  </button>
                  <button className="filter-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '14px' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                  >
                    ⏱️ จัดการกะ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}