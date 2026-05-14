import React, { useMemo, useState, useEffect } from 'react';

// 🌐 พจนานุกรมสำหรับหน้า Menu, Staff, Inventory
const dict: Record<string, any> = {
  th: {
    pageTitle: "⚙️ Operation & Setup",
    pageSubtitle: "หัวใจการเริ่มต้นร้าน POS: จัดการเมนู, พนักงาน และสต็อกในที่เดียว",
    tabMenu: "🍽️ เมนู",
    tabStaff: "👥 พนักงาน",
    tabInventory: "📦 สต็อก",
    
    // Menu Section
    menuTitle: "จัดการเมนูอาหาร",
    menuSubtitle: "เพิ่ม/แก้ไข/ลบเมนู, ตั้งราคา, และเพิ่มตัวเลือกเสริมได้ง่าย",
    btnCreateMenu: "+ สร้างเมนูใหม่",
    tabMasterMenu: "📁 เมนูหลัก",
    tabBranchMenu: "🏪 เมนูสาขา",
    searchPlaceholder: "ค้นหาชื่อ หรือ รหัสเมนู...",
    selectBranchLabel: "เลือกสาขา:",
    
    // Menu Table
    colCode: "รหัส",
    colMenuName: "ชื่อเมนู",
    colCategory: "หมวด",
    colPrice: "ราคา",
    colStatus: "สถานะ",
    colManage: "จัดการ",
    statusActive: "เปิดขาย",
    statusInactive: "ปิดจำหน่าย",
    btnEdit: "แก้ไข",
    
    // Branch Menu Table
    branchMenuTitle: "เมนูสาขา",
    branchMenuSubtitle: "ปรับแผนขายแต่ละสาขา และติดตามสินค้าหมดง่าย",
    statusReady: "พร้อมขาย",
    btnSoldOut: "แจ้งของหมด",
    colUpdate: "อัปเดต",
    
    // Staff Section
    staffTitle: "จัดการพนักงาน",
    staffSubtitle: "เพิ่มพนักงาน กำหนดตำแหน่ง และสร้างรหัสล็อกอินสำหรับ employee-app",
    btnAddStaff: "+ เพิ่มพนักงาน",
    colName: "ชื่อ",
    colRole: "ตำแหน่ง",
    colLoginCode: "รหัสล็อกอิน",
    statusStaffActive: "Active",
    statusStaffInactive: "Inactive",
    
    // Inventory Section
    invTitle: "จัดการสต็อก",
    invSubtitle: "ดูวัตถุดิบคงเหลือ และแจ้งเตือนของใกล้หมดเพื่อสั่งซื้อก่อนหน้า",
    btnUpdateStock: "อัปเดตสต็อก",
    colIngredient: "วัตถุดิบ",
    colRemaining: "คงเหลือ",
    colMin: "ขั้นต่ำ",
    statusLowStock: "ใกล้หมด",
    statusEnough: "พอใช้",

    // สาขา
    bkk: "กรุงเทพฯ (HQ)",
    cnx: "เชียงใหม่",
    hkt: "ภูเก็ต"
  },
  en: {
    pageTitle: "⚙️ Operation & Setup",
    pageSubtitle: "The heart of your POS: Manage menus, staff, and inventory in one place",
    tabMenu: "🍽️ Menu",
    tabStaff: "👥 Staff",
    tabInventory: "📦 Inventory",
    
    // Menu Section
    menuTitle: "Menu Management",
    menuSubtitle: "Easily add/edit/delete items, set prices, and add options",
    btnCreateMenu: "+ Create Menu",
    tabMasterMenu: "📁 Master Menu",
    tabBranchMenu: "🏪 Branch Menu",
    searchPlaceholder: "Search by name or code...",
    selectBranchLabel: "Select Branch:",
    
    // Menu Table
    colCode: "Code",
    colMenuName: "Menu Name",
    colCategory: "Category",
    colPrice: "Price",
    colStatus: "Status",
    colManage: "Manage",
    statusActive: "Active",
    statusInactive: "Inactive",
    btnEdit: "Edit",
    
    // Branch Menu Table
    branchMenuTitle: "Branch Menu",
    branchMenuSubtitle: "Adjust sales plans per branch and track sold-out items easily",
    statusReady: "Available",
    btnSoldOut: "Sold Out",
    colUpdate: "Update",
    
    // Staff Section
    staffTitle: "Staff Management",
    staffSubtitle: "Add staff, assign roles, and generate login codes",
    btnAddStaff: "+ Add Staff",
    colName: "Name",
    colRole: "Role",
    colLoginCode: "Login Code",
    statusStaffActive: "Active",
    statusStaffInactive: "Inactive",
    
    // Inventory Section
    invTitle: "Inventory Management",
    invSubtitle: "View remaining stock and get low stock alerts",
    btnUpdateStock: "Update Stock",
    colIngredient: "Ingredient",
    colRemaining: "In Stock",
    colMin: "Min Level",
    statusLowStock: "Low Stock",
    statusEnough: "Sufficient",

    // สาขา
    bkk: "Bangkok (HQ)",
    cnx: "Chiang Mai",
    hkt: "Phuket"
  }
};

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

  // 🌐 ระบบแปลภาษา
  const [language, setLanguage] = useState(localStorage.getItem('bizflow_language') || 'th');
  const t = dict[language];

  useEffect(() => {
    const handleLangUpdate = () => setLanguage(localStorage.getItem('bizflow_language') || 'th');
    window.addEventListener('language_updated', handleLangUpdate);
    return () => window.removeEventListener('language_updated', handleLangUpdate);
  }, []);

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
            {t.pageTitle}
          </h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            {t.pageSubtitle}
          </p>
        </div>

        <div className="segmented-control" style={{ width: '100%', maxWidth: '520px' }}>
          <button className={`segmented-btn ${activeSection === 'menu' ? 'active' : ''}`} onClick={() => setActiveSection('menu')}>
            {t.tabMenu}
          </button>
          <button className={`segmented-btn ${activeSection === 'staff' ? 'active' : ''}`} onClick={() => setActiveSection('staff')}>
            {t.tabStaff}
          </button>
          <button className={`segmented-btn ${activeSection === 'inventory' ? 'active' : ''}`} onClick={() => setActiveSection('inventory')}>
            {t.tabInventory}
          </button>
        </div>
      </div>

      {activeSection === 'menu' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{t.menuTitle}</h3>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                {t.menuSubtitle}
              </p>
            </div>
            <button className="quick-action-btn primary" style={{ minWidth: '220px', padding: '12px 24px', borderRadius: '50px' }}>
              {t.btnCreateMenu}
            </button>
          </div>

          <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="segmented-control">
              <button className={`segmented-btn ${activeMenuTab === 'master' ? 'active' : ''}`} onClick={() => setActiveMenuTab('master')}>
                {t.tabMasterMenu}
              </button>
              <button className={`segmented-btn ${activeMenuTab === 'branch' ? 'active' : ''}`} onClick={() => setActiveMenuTab('branch')}>
                {t.tabBranchMenu}
              </button>
            </div>

            {activeMenuTab === 'master' ? (
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '8px 16px', width: '300px' }}>
                <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>🔍</span>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit' }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>{t.selectBranchLabel}</span>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
                >
                  <option value="bkk">📍 {t.bkk}</option>
                  <option value="cnx">📍 {t.cnx}</option>
                  <option value="hkt">📍 {t.hkt}</option>
                </select>
              </div>
            )}
          </div>

          {activeMenuTab === 'master' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>{t.colCode}</th>
                    <th>{t.colMenuName}</th>
                    <th>{t.colCategory}</th>
                    <th style={{ textAlign: 'right' }}>{t.colPrice}</th>
                    <th style={{ textAlign: 'center' }}>{t.colStatus}</th>
                    <th style={{ textAlign: 'right' }}>{t.colManage}</th>
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
                          {item.status === 'active' ? t.statusActive : t.statusInactive}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="filter-btn" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', color: 'var(--text-main)' }}>{t.btnEdit}</button>
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
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>{t.branchMenuTitle} <span style={{ color: 'var(--accent)' }}>{language === 'th' ? branchData[selectedBranch as keyof typeof branchData].name : t[selectedBranch]}</span></h3>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>{t.branchMenuSubtitle}</p>
                </div>
              </div>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>{t.colCode}</th>
                    <th>{t.colMenuName}</th>
                    <th>{t.colCategory}</th>
                    <th style={{ textAlign: 'center' }}>{t.colStatus}</th>
                    <th style={{ textAlign: 'right' }}>{t.colUpdate}</th>
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
                          {t.statusReady}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="filter-btn" style={{ background: 'var(--loss-bg)', border: `1px solid var(--loss)40`, color: 'var(--loss)', fontWeight: 600 }}>{t.btnSoldOut}</button>
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
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{t.staffTitle}</h3>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>{t.staffSubtitle}</p>
            </div>
            <button className="quick-action-btn primary" style={{ minWidth: '220px', padding: '12px 24px', borderRadius: '50px' }}>
              {t.btnAddStaff}
            </button>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>{t.colCode}</th>
                <th>{t.colName}</th>
                <th>{t.colRole}</th>
                <th style={{ textAlign: 'center' }}>{t.colStatus}</th>
                <th style={{ textAlign: 'right' }}>{t.colLoginCode}</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(member => (
                <tr key={member.id}>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>{member.id}</td>
                  <td style={{ fontWeight: 600 }}>{member.name}</td>
                  <td>{member.role}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', background: member.status === 'active' ? 'var(--profit-bg)' : 'var(--loss-bg)', color: member.status === 'active' ? 'var(--profit)' : 'var(--loss)', fontWeight: 700, fontSize: '11px' }}>
                      {member.status === 'active' ? t.statusStaffActive : t.statusStaffInactive}
                    </span>
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
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{t.invTitle}</h3>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>{t.invSubtitle}</p>
            </div>
            <button className="quick-action-btn" style={{ minWidth: '220px', padding: '12px 24px', borderRadius: '50px' }}>
              {t.btnUpdateStock}
            </button>
          </div>
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>{t.colCode}</th>
                <th>{t.colIngredient}</th>
                <th style={{ textAlign: 'right' }}>{t.colRemaining}</th>
                <th style={{ textAlign: 'right' }}>{t.colMin}</th>
                <th style={{ textAlign: 'center' }}>{t.colStatus}</th>
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
                      <span style={{ padding: '6px 12px', borderRadius: '20px', background: isLow ? 'var(--loss-bg)' : 'var(--profit-bg)', color: isLow ? 'var(--loss)' : 'var(--profit)', fontWeight: 700, fontSize: '11px' }}>
                        {isLow ? t.statusLowStock : t.statusEnough}
                      </span>
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