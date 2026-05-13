import React, { useMemo, useState } from 'react';

const masterMenu = [
  { id: 'M001', name: 'ผัดไทยกุ้งสด', category: 'อาหารจานหลัก', price: 120, status: 'active' },
  { id: 'M002', name: 'กะเพราหมูกรอบ', category: 'อาหารจานหลัก', price: 85, status: 'active' },
  { id: 'M003', name: 'ต้มยำกุ้ง', category: 'อาหารจานหลัก', price: 150, status: 'active' },
  { id: 'M004', name: 'ชาเย็น', category: 'เครื่องดื่ม', price: 45, status: 'active' },
  { id: 'M005', name: 'ชาเฉาก๊วย', category: 'เครื่องดื่ม', price: 55, status: 'active' },
  { id: 'M006', name: 'ซาลาเปา', category: 'ของว่าง', price: 35, status: 'active' },
  { id: 'M007', name: 'เค้กช็อกโกแลต', category: 'ของหวาน', price: 90, status: 'inactive' },
  { id: 'M008', name: 'ข้าวผัดปู', category: 'อาหารจานหลัก', price: 140, status: 'active' },
];

const branchData = {
  bkk: { name: 'กรุงเทพฯ (HQ)', items: ['M001', 'M002', 'M003', 'M004', 'M005', 'M006', 'M008'] },
  cnx: { name: 'เชียงใหม่', items: ['M001', 'M002', 'M004', 'M005', 'M006', 'M008'] },
  hkt: { name: 'ภูเก็ต', items: ['M001', 'M003', 'M004', 'M005', 'M008'] }
};

const staffList = [
  { id: 'S001', name: 'ปุณยวีร์', role: 'แคชเชียร์', code: 'EMP-001', status: 'active' },
  { id: 'S002', name: 'ณัฐพล', role: 'พ่อครัว', code: 'EMP-002', status: 'active' },
  { id: 'S003', name: 'พรเทพ', role: 'แคชเชียร์', code: 'EMP-003', status: 'inactive' },
  { id: 'S004', name: 'สายรุ้ง', role: 'ผู้จัดการสาขา', code: 'EMP-004', status: 'active' },
];

const inventoryItems = [
  { id: 'I001', name: 'ไข่ไก่', stock: 120, uom: 'ฟอง', threshold: 40 },
  { id: 'I002', name: 'นมสด', stock: 18, uom: 'ลิตร', threshold: 10 },
  { id: 'I003', name: 'แป้งข้าวโพด', stock: 22, uom: 'กิโลกรัม', threshold: 10 },
  { id: 'I004', name: 'น้ำตาลทราย', stock: 8, uom: 'กิโลกรัม', threshold: 12 },
  { id: 'I005', name: 'ผักสด', stock: 30, uom: 'ชิ้น', threshold: 15 },
];

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState<'menu' | 'staff' | 'inventory'>('menu');
  const [activeMenuTab, setActiveMenuTab] = useState<'master' | 'branch'>('master');
  const [selectedBranch, setSelectedBranch] = useState('bkk');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMasterMenu = useMemo(() => {
    return masterMenu.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            ⚙️ Operation & Setup
          </h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            หัวใจการเริ่มต้นร้าน POS: จัดการเมนู, พนักงาน และสต็อกในที่เดียว
          </p>
        </div>

        <div className="segmented-control" style={{ width: '100%', maxWidth: '520px' }}>
          <button className={`segmented-btn ${activeSection === 'menu' ? 'active' : ''}`} onClick={() => setActiveSection('menu')}>
            🍽️ เมนู
          </button>
          <button className={`segmented-btn ${activeSection === 'staff' ? 'active' : ''}`} onClick={() => setActiveSection('staff')}>
            👥 พนักงาน
          </button>
          <button className={`segmented-btn ${activeSection === 'inventory' ? 'active' : ''}`} onClick={() => setActiveSection('inventory')}>
            📦 สต็อก
          </button>
        </div>
      </div>

      {activeSection === 'menu' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>จัดการเมนูอาหาร</h3>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                เพิ่ม/แก้ไข/ลบเมนู, ตั้งราคา, และเพิ่มตัวเลือกเสริมได้ง่าย
              </p>
            </div>
            <button className="quick-action-btn primary" style={{ minWidth: '220px', padding: '12px 24px', borderRadius: '50px' }}>
              + สร้างเมนูใหม่
            </button>
          </div>

          <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="segmented-control">
              <button className={`segmented-btn ${activeMenuTab === 'master' ? 'active' : ''}`} onClick={() => setActiveMenuTab('master')}>
                📁 เมนูหลัก
              </button>
              <button className={`segmented-btn ${activeMenuTab === 'branch' ? 'active' : ''}`} onClick={() => setActiveMenuTab('branch')}>
                🏪 เมนูสาขา
              </button>
            </div>

            {activeMenuTab === 'master' ? (
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '8px 16px', width: '300px' }}>
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
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
                >
                  <option value="bkk">📍 กรุงเทพฯ (HQ)</option>
                  <option value="cnx">📍 เชียงใหม่</option>
                  <option value="hkt">📍 ภูเก็ต</option>
                </select>
              </div>
            )}
          </div>

          {activeMenuTab === 'master' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>รหัส</th>
                    <th>ชื่อเมนู</th>
                    <th>หมวด</th>
                    <th style={{ textAlign: 'right' }}>ราคา</th>
                    <th style={{ textAlign: 'center' }}>สถานะ</th>
                    <th style={{ textAlign: 'right' }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMasterMenu.map(item => (
                    <tr key={item.id}>
                      <td className="mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>{item.category}</td>
                      <td className="mono" style={{ textAlign: 'right', color: 'var(--text-main)', fontWeight: 600 }}>{item.price.toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '20px', background: item.status === 'active' ? 'var(--profit-bg)' : 'var(--loss-bg)', color: item.status === 'active' ? 'var(--profit)' : 'var(--loss)', fontWeight: 700, fontSize: '11px', border: `1px solid ${item.status === 'active' ? 'var(--profit)' : 'var(--loss)'}40` }}>
                          {item.status === 'active' ? 'เปิดขาย' : 'ปิดจำหน่าย'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="filter-btn" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', color: 'var(--text-main)' }}>แก้ไข</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeMenuTab === 'branch' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>เมนูสาขา <span style={{ color: 'var(--accent)' }}>{branchData[selectedBranch as keyof typeof branchData].name}</span></h3>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>ปรับแผนขายแต่ละสาขา และติดตามสินค้าหมดง่าย</p>
                </div>
              </div>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>รหัส</th>
                    <th>ชื่อเมนู</th>
                    <th>หมวด</th>
                    <th style={{ textAlign: 'center' }}>สถานะ</th>
                    <th style={{ textAlign: 'right' }}>อัปเดต</th>
                  </tr>
                </thead>
                <tbody>
                  {masterMenu.filter(m => branchData[selectedBranch as keyof typeof branchData].items.includes(m.id)).map(item => (
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
                        <button className="filter-btn" style={{ background: 'var(--loss-bg)', border: `1px solid var(--loss)40`, color: 'var(--loss)', fontWeight: 600 }}>แจ้งของหมด</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeSection === 'staff' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>จัดการพนักงาน</h3>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>เพิ่มพนักงาน กำหนดตำแหน่ง และสร้างรหัสล็อกอินสำหรับ employee-app</p>
            </div>
            <button className="quick-action-btn primary" style={{ minWidth: '220px', padding: '12px 24px', borderRadius: '50px' }}>
              + เพิ่มพนักงาน
            </button>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>รหัส</th>
                <th>ชื่อ</th>
                <th>ตำแหน่ง</th>
                <th style={{ textAlign: 'center' }}>สถานะ</th>
                <th style={{ textAlign: 'right' }}>รหัสล็อกอิน</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(member => (
                <tr key={member.id}>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>{member.id}</td>
                  <td style={{ fontWeight: 600 }}>{member.name}</td>
                  <td>{member.role}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', background: member.status === 'active' ? 'var(--profit-bg)' : 'var(--loss-bg)', color: member.status === 'active' ? 'var(--profit)' : 'var(--loss)', fontWeight: 700, fontSize: '11px' }}>{member.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>{member.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'inventory' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>จัดการสต็อก</h3>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>ดูวัตถุดิบคงเหลือ และแจ้งเตือนของใกล้หมดเพื่อสั่งซื้อก่อนหน้า</p>
            </div>
            <button className="quick-action-btn" style={{ minWidth: '220px', padding: '12px 24px', borderRadius: '50px' }}>
              อัปเดตสต็อก
            </button>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>รหัส</th>
                <th>วัตถุดิบ</th>
                <th style={{ textAlign: 'right' }}>คงเหลือ</th>
                <th style={{ textAlign: 'right' }}>ขั้นต่ำ</th>
                <th style={{ textAlign: 'center' }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map(item => {
                const isLow = item.stock <= item.threshold;
                return (
                  <tr key={item.id}>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{item.stock} {item.uom}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{item.threshold} {item.uom}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', background: isLow ? 'var(--loss-bg)' : 'var(--profit-bg)', color: isLow ? 'var(--loss)' : 'var(--profit)', fontWeight: 700, fontSize: '11px' }}>{isLow ? 'ใกล้หมด' : 'พอใช้'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
