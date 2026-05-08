import React, { useState, useMemo } from 'react';

type EmployeeStatus = 'working' | 'available' | 'resting' | 'absent' | 'late';

interface Employee {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
  timeIn?: string;
  otHours?: number;
  wage?: number;
}

// 1. Mock Data ที่ดูเป็น Business มากขึ้น (มีเวลาเข้างาน, OT, ค่าแรง)
const mockEmployees: Employee[] = [
  { id: 'E001', name: 'สมชาย รักดี', role: 'แคชเชียร์', status: 'working', timeIn: '08:12', otHours: 1.5, wage: 500 },
  { id: 'E002', name: 'สมหญิง ขยันยิ่ง', role: 'พนักงานจัดสต๊อก', status: 'available', timeIn: '07:55', otHours: 0, wage: 450 },
  { id: 'E003', name: 'วิชัย ใจสู้', role: 'ผู้จัดการสาขา', status: 'resting', timeIn: '08:00', otHours: 2.0, wage: 800 },
  { id: 'E004', name: 'มาลี สวยงาม', role: 'พนักงานเสิร์ฟ', status: 'late', timeIn: '09:15', otHours: 0, wage: 400 }, // มาสาย
  { id: 'E005', name: 'ธนา พาทำ', role: 'พนักงานทำความสะอาด', status: 'available', timeIn: '07:30', otHours: 0, wage: 350 },
  { id: 'E006', name: 'วารี ศรีสม', role: 'แคชเชียร์', status: 'resting', timeIn: '08:05', otHours: 1.0, wage: 500 },
  { id: 'E007', name: 'กิตติ ใจดี', role: 'พนักงานเสิร์ฟ', status: 'absent', wage: 400 },
  { id: 'E008', name: 'ฟ้าใส ชื่นใจ', role: 'ครัว', status: 'absent', wage: 600 },
];

const statusConfig = {
  working: { label: 'กำลังทำงาน', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  available: { label: 'ว่างงาน', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  resting: { label: 'กำลังพัก', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  absent: { label: 'ไม่มา/ลา', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  late: { label: 'มาสาย', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' }, // เพิ่มสีชมพูแดงสำหรับมาสาย
};

// ฟังก์ชันสร้าง Avatar จากชื่อย่อ
const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
  return name.substring(0, 2);
};

export default function EmployeePage() {
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ดึงรายการตำแหน่งทั้งหมดออกมาสำหรับ Dropdown
  const roles = useMemo(() => Array.from(new Set(mockEmployees.map(e => e.role))), []);

  // ระบบ Search & Filter (รวมสถานะ, ค้นหาชื่อ, ตำแหน่ง)
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      const matchStatus = filterStatus === 'all' || emp.status === filterStatus;
      const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = filterRole === 'all' || emp.role === filterRole;
      return matchStatus && matchSearch && matchRole;
    });
  }, [filterStatus, searchQuery, filterRole]);

  // คำนวณ Summary Metrics
  const totalEmployees = mockEmployees.length;
  const totalLate = mockEmployees.filter(e => e.status === 'late').length;
  const totalAbsent = mockEmployees.filter(e => e.status === 'absent').length;
  const totalOT = mockEmployees.reduce((sum, e) => sum + (e.otHours || 0), 0);

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      
      {/* 1. Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0 }}>👥 จัดการบุคลากร (Employee Hub)</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          style={{
            background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 24px', 
            borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(170, 59, 255, 0.3)', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span> เพิ่มพนักงานใหม่
        </button>
      </div>

      {/* 2. Dashboard Summary */}
      <div className="finance-cards" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px' }}>พนักงานทั้งหมด</h3>
          <p className="amount" style={{ fontSize: '32px', color: 'var(--text-main)' }}>{totalEmployees} <span style={{fontSize: '16px', color:'var(--text-muted)'}}>คน</span></p>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px' }}>มาสายวันนี้</h3>
          <p className="amount" style={{ fontSize: '32px', color: '#ec4899' }}>{totalLate} <span style={{fontSize: '16px', color:'var(--text-muted)'}}>คน</span></p>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px' }}>ลา / ขาดงาน</h3>
          <p className="amount" style={{ fontSize: '32px', color: 'var(--loss)' }}>{totalAbsent} <span style={{fontSize: '16px', color:'var(--text-muted)'}}>คน</span></p>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px' }}>OT รวมวันนี้</h3>
          <p className="amount" style={{ fontSize: '32px', color: '#F59E0B' }}>{totalOT} <span style={{fontSize: '16px', color:'var(--text-muted)'}}>ชม.</span></p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div style={{ 
        display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', 
        background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)'
      }}>
        <input 
          type="text" 
          placeholder="🔍 ค้นหาชื่อ หรือ รหัสพนักงาน..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: '1 1 200px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#11151F', color: 'var(--text-main)', outline: 'none' }}
        />
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#11151F', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">📁 ทุกตำแหน่ง</option>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', background: '#11151F', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
           {['all', 'working', 'available', 'resting', 'late', 'absent'].map((status) => {
             const isAll = status === 'all';
             const config = isAll ? null : statusConfig[status as EmployeeStatus];
             const isActive = filterStatus === status;
             return (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                style={{
                  background: isActive ? (isAll ? 'rgba(255,255,255,0.1)' : config!.bg) : 'transparent',
                  color: isActive ? (isAll ? '#FFF' : config!.color) : 'var(--text-muted)',
                  border: isActive ? `1px solid ${isAll ? '#FFF' : config!.color}40` : '1px solid transparent',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s'
                }}
              >
                {isAll ? 'ทั้งหมด' : config!.label}
              </button>
             )
           })}
        </div>
      </div>
      
      {/* 4. Employee Cards Grid (auto-fill แก้พื้นที่ว่าง) */}
      {filteredEmployees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>📭</span>
          ไม่พบข้อมูลพนักงานที่ค้นหา
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredEmployees.map((emp) => {
            const statusStyle = statusConfig[emp.status];
            
            return (
              <div key={emp.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: statusStyle.color, boxShadow: `0 0 10px ${statusStyle.color}` }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    
                    {/* Avatar ย่อชื่อ (ดูหรูหราขึ้น) */}
                    <div style={{ 
                      width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: statusStyle.bg, color: statusStyle.color, fontWeight: 'bold', fontSize: '16px', border: `1px solid ${statusStyle.color}50`
                    }}>
                      {getInitials(emp.name)}
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>{emp.id}</div>
                      <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)', textTransform: 'none' }}>{emp.name}</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>{emp.role}</div>
                    </div>
                  </div>
                  
                  <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: statusStyle.color, backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.color}40`, whiteSpace: 'nowrap' }}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* ข้อมูลเวลาเข้างาน และ OT */}
                <div style={{ background: '#11151F', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>เข้างาน: </span>
                    <span style={{ color: emp.timeIn ? 'var(--text-main)' : 'var(--loss)', fontFamily: 'JetBrains Mono' }}>{emp.timeIn || 'ยังไม่เข้างาน'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>OT: </span>
                    <span style={{ color: emp.otHours ? '#F59E0B' : 'var(--text-main)', fontFamily: 'JetBrains Mono' }}>{emp.otHours || 0} ชม.</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  <button className="filter-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '13px' }}>
                    📝 แก้ไขข้อมูล
                  </button>
                  <button className="filter-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '13px' }}>
                    ⏱️ ลงเวลา (Manual)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Modal เพิ่มพนักงาน */}
      {isAddModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%', animation: 'pageEnter 0.3s' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>✨ เพิ่มพนักงานใหม่</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>ชื่อ-นามสกุล</label>
                <input type="text" placeholder="ระบุชื่อพนักงาน" style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#11151F', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>ตำแหน่ง</label>
                <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#11151F', color: '#fff' }}>
                  <option>แคชเชียร์</option>
                  <option>ครัว</option>
                  <option>พนักงานเสิร์ฟ</option>
                  <option>ผู้จัดการสาขา</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>เงินเดือน/ค่าแรง</label>
                  <input type="number" placeholder="เช่น 15000" style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#11151F', color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>กะทำงาน</label>
                  <input type="time" defaultValue="08:00" style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#11151F', color: '#fff' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsAddModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>ยกเลิก</button>
              <button onClick={() => setIsAddModalOpen(false)} style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>บันทึกข้อมูล</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}