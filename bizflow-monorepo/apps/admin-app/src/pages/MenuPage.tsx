import React, { useState, useMemo } from 'react';

// =========================================
// MOCK DATA (ข้อมูลจำลอง)
// =========================================
const masterMenu = [
  { id: 'M001', name: 'ผัดไทยกุ้งสด', category: 'อาหารจานหลัก', price: 120, status: 'active' },
  { id: 'M002', name: 'กะเพราหมูกรอบ', category: 'อาหารจานหลัก', price: 85, status: 'active' },
  { id: 'M003', name: 'ต้มยำกุ้ง', category: 'อาหารจานหลัก', price: 150, status: 'active' },
  { id: 'M004', name: 'ชาเย็น', category: 'เครื่องดื่ม', price: 45, status: 'active' },
  { id: 'M005', name: 'อิตาเลียนโซดา', category: 'เครื่องดื่ม', price: 55, status: 'active' },
  { id: 'M006', name: 'เค้กช็อกโกแลต', category: 'ของหวาน', price: 90, status: 'inactive' },
  { id: 'M007', name: 'ข้าวผัดปู', category: 'อาหารจานหลัก', price: 140, status: 'active' },
];

const branchData = {
  bkk: { name: 'กรุงเทพฯ (HQ)', items: ['M001', 'M002', 'M003', 'M004', 'M005', 'M006', 'M007'] },
  cnx: { name: 'เชียงใหม่', items: ['M001', 'M002', 'M004', 'M007'] }, // ไม่มีต้มยำ, โซดา, เค้ก
  hkt: { name: 'ภูเก็ต', items: ['M001', 'M003', 'M004', 'M005'] } // ไม่มีกะเพรา, เค้ก, ข้าวผัด
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<'master' | 'branch'>('master');
  const [selectedBranch, setSelectedBranch] = useState('bkk');
  const [searchQuery, setSearchQuery] = useState('');

  // กรองเมนูหลักตามการค้นหา
  const filteredMasterMenu = useMemo(() => {
    return masterMenu.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="page-container">
      {/* =========================================
          1. HEADER SECTION
          ========================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            🍽️ จัดการเมนูอาหาร (Menu Management)
          </h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            จัดการเมนูส่วนกลาง และควบคุมรายการอาหารที่เปิดขายในแต่ละสาขา
          </p>
        </div>
        
        {activeTab === 'master' && (
          <button className="quick-action-btn primary" style={{ width: 'auto', padding: '12px 24px', borderRadius: '50px' }}>
            + สร้างเมนูใหม่
          </button>
        )}
      </div>

      {/* =========================================
          2. CONTROLS & TABS (แท็บเลือกหน้า)
          ========================================= */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Segmented Control (Tabs) */}
        <div className="segmented-control">
          <button 
            className={`segmented-btn ${activeTab === 'master' ? 'active' : ''}`} 
            onClick={() => setActiveTab('master')}
          >
            📁 เมนูหลัก (Master Menu)
          </button>
          <button 
            className={`segmented-btn ${activeTab === 'branch' ? 'active' : ''}`} 
            onClick={() => setActiveTab('branch')}
          >
            🏪 เมนูแต่ละสาขา (Branch Menu)
          </button>
        </div>

        {/* เครื่องมือด้านขวา เปลี่ยนไปตามแท็บที่เลือก */}
        {activeTab === 'master' ? (
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '8px 16px', width: '300px' }}>
            <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรือ รหัสเมนู..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>เลือกสาขา:</span>
            <select 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              <option value="bkk">📍 กรุงเทพฯ (HQ)</option>
              <option value="cnx">📍 เชียงใหม่</option>
              <option value="hkt">📍 ภูเก็ต</option>
            </select>
          </div>
        )}
      </div>

      {/* =========================================
          3. TAB 1: MASTER MENU (ตารางเมนูหลัก)
          ========================================= */}
      {activeTab === 'master' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>รหัส</th>
                <th>ชื่อเมนู</th>
                <th>หมวดหมู่</th>
                <th style={{ textAlign: 'right' }}>ราคามาตรฐาน (฿)</th>
                <th style={{ textAlign: 'center' }}>สถานะส่วนกลาง</th>
                <th style={{ textAlign: 'right' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredMasterMenu.map(item => (
                <tr key={item.id}>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>
                    <span style={{ background: 'var(--bg-main)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', border: '1px solid var(--border-light)' }}>
                      {item.category}
                    </span>
                  </td>
                  <td className="mono" style={{ textAlign: 'right', color: 'var(--text-main)', fontWeight: 600 }}>{item.price.toFixed(2)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                      padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                      background: item.status === 'active' ? 'var(--profit-bg)' : 'var(--loss-bg)',
                      color: item.status === 'active' ? 'var(--profit)' : 'var(--loss)',
                      border: `1px solid ${item.status === 'active' ? 'var(--profit)' : 'var(--loss)'}40`
                    }}>
                      {item.status === 'active' ? 'เปิดขาย (Active)' : 'ระงับชั่วคราว'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="filter-btn" style={{ background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)' }}>แก้ไข</button>
                  </td>
                </tr>
              ))}
              {filteredMasterMenu.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>🍽️</div>
                    ไม่พบเมนูอาหารที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================
          4. TAB 2: BRANCH SPECIFIC MENU (ตารางสาขา)
          ========================================= */}
      {activeTab === 'branch' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--text-main)', textTransform: 'none' }}>
                รายการที่เปิดขายใน <span style={{ color: 'var(--accent)' }}>{branchData[selectedBranch as keyof typeof branchData].name}</span>
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>พนักงานสาขาสามารถกดแจ้งของหมด (Sold Out) เพื่อให้หายไปจากหน้าสั่งอาหารได้</p>
            </div>
          </div>
          
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>รหัส</th>
                <th>ชื่อเมนู</th>
                <th>หมวดหมู่</th>
                <th style={{ textAlign: 'center' }}>สถานะในสาขานี้</th>
                <th style={{ textAlign: 'right' }}>อัปเดตสต็อกหน้าร้าน</th>
              </tr>
            </thead>
            <tbody>
              {masterMenu
                .filter(m => branchData[selectedBranch as keyof typeof branchData].items.includes(m.id))
                .map(item => (
                <tr key={item.id}>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: 'var(--profit-bg)', color: 'var(--profit)', border: '1px solid var(--profit)40' }}>
                      <div style={{ width: '6px', height: '6px', background: 'var(--profit)', borderRadius: '50%' }}></div>
                      พร้อมขาย
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="filter-btn" style={{ background: 'var(--loss-bg)', border: `1px solid var(--loss)40`, color: 'var(--loss)', fontWeight: 600 }}>
                      แจ้งของหมด (Sold Out)
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* กรณีสาขานั้นไม่มีรายการอาหารเลย */}
              {masterMenu.filter(m => branchData[selectedBranch as keyof typeof branchData].items.includes(m.id)).length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    ยังไม่มีการเพิ่มเมนูสำหรับสาขานี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
}