import React, { useMemo, useState } from 'react';

// =========================================
// MOCK DATA (ข้อมูลเริ่มต้น)
// =========================================
const initialMasterMenu = [
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

// 🚀 อัปเดต: เพิ่ม salary, deductions, warnings
const initialStaffList = [
  { id: 'S001', name: 'ปุณยวีร์', role: 'แคชเชียร์', code: 'EMP-001', status: 'active', salary: 15000, deductions: 0, warnings: 0 },
  { id: 'S002', name: 'ณัฐพล', role: 'พ่อครัว', code: 'EMP-002', status: 'active', salary: 18000, deductions: 500, warnings: 1 },
  { id: 'S003', name: 'พรเทพ', role: 'แคชเชียร์', code: 'EMP-003', status: 'inactive', salary: 15000, deductions: 0, warnings: 3 },
  { id: 'S004', name: 'สายรุ้ง', role: 'ผู้จัดการสาขา', code: 'EMP-004', status: 'active', salary: 28000, deductions: 0, warnings: 0 },
];

// 🚀 อัปเดต: เพิ่ม price (ต้นทุนต่อหน่วย)
const initialInventoryItems = [
  { id: 'I001', name: 'ไข่ไก่', stock: 120, uom: 'ฟอง', threshold: 40, price: 4.5 },
  { id: 'I002', name: 'นมสด', stock: 18, uom: 'ลิตร', threshold: 10, price: 45 },
  { id: 'I003', name: 'แป้งข้าวโพด', stock: 22, uom: 'กิโลกรัม', threshold: 10, price: 35 },
  { id: 'I004', name: 'น้ำตาลทราย', stock: 8, uom: 'กิโลกรัม', threshold: 12, price: 25 },
  { id: 'I005', name: 'ผักสด', stock: 30, uom: 'แพ็ค', threshold: 15, price: 20 },
];

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState<'menu' | 'staff' | 'inventory'>('menu');
  const [activeMenuTab, setActiveMenuTab] = useState<'master' | 'branch'>('master');
  const [selectedBranch, setSelectedBranch] = useState('bkk');
  const [searchQuery, setSearchQuery] = useState('');

  const [menuList, setMenuList] = useState(initialMasterMenu);
  const [staffData, setStaffData] = useState(initialStaffList);
  const [inventoryData, setInventoryData] = useState(initialInventoryItems);

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);

  const [newMenu, setNewMenu] = useState({ name: '', category: 'อาหารจานหลัก', price: '', status: 'active' });
  const [newStaff, setNewStaff] = useState({ name: '', role: 'แคชเชียร์', status: 'active', salary: '' });
  
  // 🚀 อัปเดต: เพิ่มฟิลด์ price เข้ามาใน State ของ Popup
  const [stockUpdate, setStockUpdate] = useState({ id: 'I001', amount: '', type: 'add', price: '' });

  const filteredMasterMenu = useMemo(() => {
    return menuList.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, menuList]);

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `M${String(menuList.length + 1).padStart(3, '0')}`;
    const newItem = { id: newId, name: newMenu.name, category: newMenu.category, price: Number(newMenu.price), status: newMenu.status };
    setMenuList([...menuList, newItem]);
    setNewMenu({ name: '', category: 'อาหารจานหลัก', price: '', status: 'active' });
    setIsAddMenuOpen(false);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `S${String(staffData.length + 1).padStart(3, '0')}`;
    const newCode = `EMP-${String(staffData.length + 1).padStart(3, '0')}`;
    const newItem = { id: newId, name: newStaff.name, role: newStaff.role, code: newCode, status: newStaff.status, salary: Number(newStaff.salary) || 15000, deductions: 0, warnings: 0 };
    setStaffData([...staffData, newItem]); 
    setNewStaff({ name: '', role: 'แคชเชียร์', status: 'active', salary: '' }); 
    setIsAddStaffOpen(false); 
  };

  // 🚀 อัปเดต: ฟังก์ชันรองรับการเปลี่ยนราคาต้นทุนใหม่
  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = inventoryData.map(item => {
      if (item.id === stockUpdate.id) {
        const change = Number(stockUpdate.amount);
        const newStock = stockUpdate.type === 'add' ? item.stock + change : item.stock - change;
        
        // ถ้าระบุราคาใหม่ตอน "เติมของ" ให้อัปเดตต้นทุนต่อหน่วยใหม่ (ถ้าไม่ระบุให้ใช้ราคาเดิม)
        const newPrice = (stockUpdate.type === 'add' && stockUpdate.price !== '') 
                         ? Number(stockUpdate.price) 
                         : item.price;

        return { ...item, stock: Math.max(0, newStock), price: newPrice };
      }
      return item;
    });
    setInventoryData(updatedData);
    setIsUpdateStockOpen(false);
    setStockUpdate({ id: 'I001', amount: '', type: 'add', price: '' });
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>⚙️ Operation & Setup</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>จัดการหัวใจหลักของร้านอาหารในจุดเดียว</p>
        </div>
        <div className="segmented-control" style={{ minWidth: '400px' }}>
          <button className={`segmented-btn ${activeSection === 'menu' ? 'active' : ''}`} onClick={() => setActiveSection('menu')}>🍽️ เมนู</button>
          <button className={`segmented-btn ${activeSection === 'staff' ? 'active' : ''}`} onClick={() => setActiveSection('staff')}>👥 พนักงาน</button>
          <button className={`segmented-btn ${activeSection === 'inventory' ? 'active' : ''}`} onClick={() => setActiveSection('inventory')}>📦 สต็อก</button>
        </div>
      </div>

      {/* --- MENU TAB --- */}
      {activeSection === 'menu' && (
        <div style={{ animation: 'pageEnter 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>จัดการรายการอาหาร</h3>
            <button className="quick-action-btn primary" onClick={() => setIsAddMenuOpen(true)}>+ สร้างเมนูใหม่</button>
          </div>
          <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div className="segmented-control">
              <button className={`segmented-btn ${activeMenuTab === 'master' ? 'active' : ''}`} onClick={() => setActiveMenuTab('master')}>📁 เมนูหลัก</button>
              <button className={`segmented-btn ${activeMenuTab === 'branch' ? 'active' : ''}`} onClick={() => setActiveMenuTab('branch')}>🏪 เมนูสาขา</button>
            </div>
            <div className="search-box" style={{ width: '350px' }}>
               <span>🔍</span>
               <input type="text" placeholder="ค้นหาเมนู..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="modern-table">
              <thead>
                <tr><th>รหัส</th><th>ชื่อเมนู</th><th>หมวดหมู่</th><th style={{ textAlign: 'right' }}>ราคา</th><th style={{ textAlign: 'center' }}>สถานะ</th><th style={{ textAlign: 'right' }}>จัดการ</th></tr>
              </thead>
              <tbody>
                {filteredMasterMenu.map(item => (
                  <tr key={item.id}>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                    <td style={{ fontWeight: 700 }}>{item.name}</td>
                    <td>{item.category}</td>
                    <td className="mono" style={{ textAlign: 'right', fontWeight: 800 }}>฿{item.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, background: item.status === 'active' ? 'var(--profit-bg)' : 'var(--loss-bg)', color: item.status === 'active' ? 'var(--profit)' : 'var(--loss)' }}>
                        {item.status === 'active' ? 'เปิดขาย' : 'ปิดจำหน่าย'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}><button className="filter-btn">แก้ไข</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- STAFF TAB --- */}
      {activeSection === 'staff' && (
        <div style={{ animation: 'pageEnter 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>ข้อมูลและบัญชีเงินเดือนพนักงาน</h3>
            <button className="quick-action-btn primary" onClick={() => setIsAddStaffOpen(true)}>+ เพิ่มพนักงาน</button>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>รหัส</th><th>ชื่อ-นามสกุล</th><th>ตำแหน่ง</th>
                  <th style={{ textAlign: 'right' }}>เงินเดือน (฿)</th><th style={{ textAlign: 'right' }}>หักเงิน (฿)</th>
                  <th style={{ textAlign: 'center' }}>ตำหนิ</th><th style={{ textAlign: 'center' }}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map(staff => (
                  <tr key={staff.id}>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>{staff.id}</td>
                    <td style={{ fontWeight: 700 }}>{staff.name} <br/><span className="mono" style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 'bold' }}>{staff.code}</span></td>
                    <td>{staff.role}</td>
                    <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>{staff.salary.toLocaleString()}</td>
                    <td className="mono" style={{ textAlign: 'right', color: staff.deductions > 0 ? 'var(--loss)' : 'var(--text-muted)' }}>{staff.deductions > 0 ? `-${staff.deductions.toLocaleString()}` : '-'}</td>
                    <td style={{ textAlign: 'center' }}>{staff.warnings > 0 ? (<span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: 'var(--loss-bg)', color: 'var(--loss)' }}>{staff.warnings} ครั้ง</span>) : (<span style={{ color: 'var(--text-muted)' }}>-</span>)}</td>
                    <td style={{ textAlign: 'center' }}><span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, background: staff.status === 'active' ? 'var(--profit-bg)' : 'var(--loss-bg)', color: staff.status === 'active' ? 'var(--profit)' : 'var(--loss)' }}>{staff.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- INVENTORY TAB --- */}
      {activeSection === 'inventory' && (
        <div style={{ animation: 'pageEnter 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>สต็อกวัตถุดิบและมูลค่าคลังสินค้า</h3>
            <button className="quick-action-btn primary" onClick={() => setIsUpdateStockOpen(true)}>📦 ปรับปรุงสต็อก</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '16px', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>มูลค่าสต็อกรวมทั้งหมด</div>
              <div className="mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)', marginTop: '8px' }}>
                ฿{inventoryData.reduce((sum, item) => sum + (item.stock * item.price), 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>รหัส</th><th>วัตถุดิบ</th><th style={{ textAlign: 'right' }}>ต้นทุน/หน่วย (฿)</th>
                  <th style={{ textAlign: 'right' }}>คงเหลือ</th><th style={{ textAlign: 'right' }}>มูลค่ารวม (฿)</th><th style={{ textAlign: 'center' }}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.map(item => {
                  const isLow = item.stock <= item.threshold;
                  const totalValue = item.stock * item.price;
                  return (
                    <tr key={item.id}>
                      <td className="mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                      <td style={{ fontWeight: 700 }}>{item.name}</td>
                      <td className="mono" style={{ textAlign: 'right' }}>{item.price.toFixed(2)}</td>
                      <td className="mono" style={{ textAlign: 'right', fontWeight: 800 }}>{item.stock} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.uom}</span></td>
                      <td className="mono" style={{ textAlign: 'right', fontWeight: 600, color: 'var(--accent)' }}>{totalValue.toLocaleString()}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, background: isLow ? 'var(--loss-bg)' : 'var(--profit-bg)', color: isLow ? 'var(--loss)' : 'var(--profit)' }}>
                          {isLow ? '⚠️ ต้องสั่งเพิ่ม' : 'ปกติ'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- POPUP 1: สร้างเมนูใหม่ --- */}
      {isAddMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'pageEnter 0.2s ease-out' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>✨ สร้างเมนูใหม่</h3>
              <button onClick={() => setIsAddMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSaveMenu}>
              <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label className="input-label">ชื่อเมนู</label>
                  <input type="text" className="input-field" required placeholder="เช่น ชาเขียวมะนาว" value={newMenu.name} onChange={(e) => setNewMenu({...newMenu, name: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="input-label">หมวดหมู่</label>
                    <select className="input-field" value={newMenu.category} onChange={(e) => setNewMenu({...newMenu, category: e.target.value})}>
                      <option value="อาหารจานหลัก">อาหารจานหลัก</option>
                      <option value="ของว่าง">ของว่าง</option>
                      <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                      <option value="ของหวาน">ของหวาน</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">ราคา (฿)</label>
                    <input type="number" className="input-field" required min="0" placeholder="0" value={newMenu.price} onChange={(e) => setNewMenu({...newMenu, price: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="input-label">สถานะเริ่มต้น</label>
                  <select className="input-field" value={newMenu.status} onChange={(e) => setNewMenu({...newMenu, status: e.target.value})}>
                    <option value="active">🟢 เปิดขาย (Active)</option>
                    <option value="inactive">🔴 ปิดจำหน่าย (Inactive)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn-outline" onClick={() => setIsAddMenuOpen(false)}>ยกเลิก</button>
                <button type="submit" className="quick-action-btn primary">บันทึกข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- POPUP 2: เพิ่มพนักงาน --- */}
      {isAddStaffOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'pageEnter 0.2s ease-out' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '32px', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>👤 เพิ่มพนักงานใหม่</h3>
               <button onClick={() => setIsAddStaffOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>✕</button>
             </div>
             <form onSubmit={handleSaveStaff}>
                <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
                   <div>
                     <label className="input-label">ชื่อพนักงาน</label>
                     <input type="text" className="input-field" required placeholder="เช่น สมหญิง รักดี" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} />
                   </div>
                   <div>
                     <label className="input-label">ตำแหน่ง</label>
                     <select className="input-field" value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}>
                        <option value="แคชเชียร์">แคชเชียร์</option>
                        <option value="พ่อครัว">พ่อครัว / แม่ครัว</option>
                        <option value="ผู้จัดการสาขา">ผู้จัดการสาขา</option>
                     </select>
                   </div>
                   <div>
                     <label className="input-label">เงินเดือนเริ่มต้น (฿)</label>
                     <input type="number" className="input-field" required min="0" placeholder="15000" value={newStaff.salary} onChange={(e) => setNewStaff({...newStaff, salary: e.target.value})} />
                   </div>
                   <div>
                     <label className="input-label">สถานะการทำงาน</label>
                     <select className="input-field" value={newStaff.status} onChange={(e) => setNewStaff({...newStaff, status: e.target.value})}>
                       <option value="active">🟢 กำลังทำงาน (Active)</option>
                       <option value="inactive">🔴 ลาออก/พักงาน (Inactive)</option>
                     </select>
                   </div>
                   <div style={{ padding: '12px', background: 'rgba(103, 232, 249, 0.05)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                     <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>* รหัสเข้าสู่ระบบ (เช่น EMP-XXX) จะถูกสร้างให้อัตโนมัติเมื่อกดบันทึก</p>
                   </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                   <button type="button" className="btn-outline" onClick={() => setIsAddStaffOpen(false)}>ยกเลิก</button>
                   <button type="submit" className="quick-action-btn primary">บันทึกพนักงาน</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* --- POPUP 3: ปรับปรุงสต็อก (พร้อมกรอกราคา) --- */}
      {isUpdateStockOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'pageEnter 0.2s ease-out' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '32px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>📦 ปรับปรุงสต็อกวัตถุดิบ</h3>
              <button onClick={() => setIsUpdateStockOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleUpdateStock}>
              <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label className="input-label">เลือกวัตถุดิบ</label>
                  <select className="input-field" value={stockUpdate.id} onChange={e => setStockUpdate({...stockUpdate, id: e.target.value})}>
                    {inventoryData.map(item => <option key={item.id} value={item.id}>{item.name} (คงเหลือ: {item.stock})</option>)}
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="input-label">ประเภทการปรับ</label>
                    <select className="input-field" value={stockUpdate.type} onChange={e => setStockUpdate({...stockUpdate, type: e.target.value})}>
                      <option value="add">➕ เติมของ</option>
                      <option value="sub">➖ เบิกออก (ใช้ไป)</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">จำนวน</label>
                    <input type="number" className="input-field" placeholder="ระบุตัวเลข" required min="1" value={stockUpdate.amount} onChange={e => setStockUpdate({...stockUpdate, amount: e.target.value})} />
                  </div>
                </div>

                {/* 🚀 ช่องกรอกราคาจะโผล่มาแค่ตอนเลือก "เติมของ" */}
                {stockUpdate.type === 'add' && (
                  <div>
                    <label className="input-label">ราคาซื้อใหม่ / หน่วย (฿)</label>
                    <input type="number" className="input-field" placeholder="เว้นว่างไว้หากใช้ราคาเดิม" min="0" step="0.01" value={stockUpdate.price} onChange={e => setStockUpdate({...stockUpdate, price: e.target.value})} />
                  </div>
                )}

              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn-outline" onClick={() => setIsUpdateStockOpen(false)}>ปิด</button>
                <button type="submit" className="quick-action-btn primary">ยืนยันการทำรายการ</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}