import React, { useMemo, useState } from 'react';

type Section = 'menu' | 'staff' | 'inventory';
type Status = 'active' | 'inactive';
type DrawerType = Section | null;
type DrawerMode = 'create' | 'edit';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  status: Status;
  addOns: string[];
};

type Staff = {
  id: string;
  name: string;
  role: string;
  code: string;
  pin: string;
  status: Status;
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  cost: number;
  status: Status;
};

const menuSeed: MenuItem[] = [
  {
    id: 'M001',
    name: 'ผัดไทยกุ้งสด',
    category: 'อาหารจานหลัก',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500&q=80',
    status: 'active',
    addOns: ['เพิ่มไข่ดาว', 'เพิ่มกุ้ง', 'ไม่ใส่ถั่ว'],
  },
  {
    id: 'M002',
    name: 'กะเพราหมูกรอบ',
    category: 'อาหารจานหลัก',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&q=80',
    status: 'active',
    addOns: ['เพิ่มไข่ดาว', 'เผ็ดน้อย', 'เผ็ดมาก'],
  },
  {
    id: 'M003',
    name: 'ชาเย็น',
    category: 'เครื่องดื่ม',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
    status: 'active',
    addOns: ['หวานน้อย', 'เพิ่มไข่มุก', 'เพิ่มวิปครีม'],
  },
  {
    id: 'M004',
    name: 'เค้กช็อกโกแลต',
    category: 'ของหวาน',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    status: 'inactive',
    addOns: ['เพิ่มซอส', 'เพิ่มไอศกรีม'],
  },
];

const staffSeed: Staff[] = [
  { id: 'S001', name: 'สมชาย ใจดี', role: 'แคชเชียร์', code: 'EMP-001', pin: '1234', status: 'active' },
  { id: 'S002', name: 'มาลี ทำครัว', role: 'พ่อครัว', code: 'EMP-002', pin: '2468', status: 'active' },
  { id: 'S003', name: 'นที บริการ', role: 'พนักงานเสิร์ฟ', code: 'EMP-003', pin: '1357', status: 'inactive' },
];

const inventorySeed: InventoryItem[] = [
  { id: 'I001', name: 'ไข่ไก่', category: 'วัตถุดิบสด', stock: 24, unit: 'ฟอง', minStock: 30, cost: 5, status: 'active' },
  { id: 'I002', name: 'นมสด', category: 'เครื่องดื่ม', stock: 12, unit: 'ลิตร', minStock: 8, cost: 45, status: 'active' },
  { id: 'I003', name: 'หมูกรอบ', category: 'วัตถุดิบสด', stock: 5, unit: 'กก.', minStock: 6, cost: 240, status: 'active' },
  { id: 'I004', name: 'ชาไทย', category: 'วัตถุดิบแห้ง', stock: 18, unit: 'ถุง', minStock: 10, cost: 120, status: 'active' },
];

const menuCategories = ['ทั้งหมด', 'อาหารจานหลัก', 'เครื่องดื่ม', 'ของหวาน', 'ของว่าง'];
const staffRoles = ['ทั้งหมด', 'แอดมิน', 'แคชเชียร์', 'พ่อครัว', 'พนักงานเสิร์ฟ'];
const inventoryCategories = ['ทั้งหมด', 'วัตถุดิบสด', 'วัตถุดิบแห้ง', 'เครื่องดื่ม', 'บรรจุภัณฑ์'];

const emptyMenu: Omit<MenuItem, 'id'> = {
  name: '',
  category: 'อาหารจานหลัก',
  price: 0,
  imageUrl: '',
  status: 'active',
  addOns: [],
};

const emptyStaff: Omit<Staff, 'id'> = {
  name: '',
  role: 'แคชเชียร์',
  code: '',
  pin: '',
  status: 'active',
};

const emptyInventory: Omit<InventoryItem, 'id'> = {
  name: '',
  category: 'วัตถุดิบสด',
  stock: 0,
  unit: 'ชิ้น',
  minStock: 0,
  cost: 0,
  status: 'active',
};

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuCategory, setMenuCategory] = useState('ทั้งหมด');
  const [staffRole, setStaffRole] = useState('ทั้งหมด');
  const [inventoryCategory, setInventoryCategory] = useState('ทั้งหมด');
  const [stockView, setStockView] = useState<'all' | 'low'>('all');

  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuSeed);
  const [staffList, setStaffList] = useState<Staff[]>(staffSeed);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(inventorySeed);

  const [drawerType, setDrawerType] = useState<DrawerType>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [menuForm, setMenuForm] = useState<Omit<MenuItem, 'id'>>(emptyMenu);
  const [staffForm, setStaffForm] = useState<Omit<Staff, 'id'>>(emptyStaff);
  const [inventoryForm, setInventoryForm] = useState<Omit<InventoryItem, 'id'>>(emptyInventory);
  const [addOnText, setAddOnText] = useState('');

  const activeMenus = menuItems.filter((item) => item.status === 'active').length;
  const activeStaff = staffList.filter((item) => item.status === 'active').length;
  const lowStock = inventoryItems.filter((item) => item.stock <= item.minStock).length;

  const filteredMenu = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchCategory = menuCategory === 'ทั้งหมด' || item.category === menuCategory;
      return matchQuery && matchCategory;
    });
  }, [menuItems, searchQuery, menuCategory]);

  const filteredStaff = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return staffList.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q);
      const matchRole = staffRole === 'ทั้งหมด' || item.role === staffRole;
      return matchQuery && matchRole;
    });
  }, [staffList, searchQuery, staffRole]);

  const filteredInventory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return inventoryItems.filter((item) => {
      const matchQuery =
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchCategory = inventoryCategory === 'ทั้งหมด' || item.category === inventoryCategory;
      const matchLowStock = stockView === 'all' || item.stock <= item.minStock;
      return matchQuery && matchCategory && matchLowStock;
    });
  }, [inventoryItems, searchQuery, inventoryCategory, stockView]);

  const resetForms = () => {
    setMenuForm(emptyMenu);
    setStaffForm(emptyStaff);
    setInventoryForm(emptyInventory);
    setAddOnText('');
    setEditingId(null);
  };

  const closeDrawer = () => {
    setDrawerType(null);
    resetForms();
  };

  const openCreateDrawer = (type: Section) => {
    resetForms();
    setDrawerType(type);
    setDrawerMode('create');
  };

  const openEditDrawer = (type: Section, id: string) => {
    setDrawerType(type);
    setDrawerMode('edit');
    setEditingId(id);

    if (type === 'menu') {
      const item = menuItems.find((menu) => menu.id === id);
      if (item) {
        setMenuForm({
          name: item.name,
          category: item.category,
          price: item.price,
          imageUrl: item.imageUrl,
          status: item.status,
          addOns: item.addOns,
        });
        setAddOnText(item.addOns.join(', '));
      }
    }

    if (type === 'staff') {
      const item = staffList.find((staff) => staff.id === id);
      if (item) {
        setStaffForm({
          name: item.name,
          role: item.role,
          code: item.code,
          pin: item.pin,
          status: item.status,
        });
      }
    }

    if (type === 'inventory') {
      const item = inventoryItems.find((inventory) => inventory.id === id);
      if (item) {
        setInventoryForm({
          name: item.name,
          category: item.category,
          stock: item.stock,
          unit: item.unit,
          minStock: item.minStock,
          cost: item.cost,
          status: item.status,
        });
      }
    }
  };

  const handleSaveMenu = (event: React.FormEvent) => {
    event.preventDefault();

    const parsedAddOns = addOnText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (drawerMode === 'edit' && editingId) {
      setMenuItems((items) =>
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...menuForm,
                price: Number(menuForm.price),
                addOns: parsedAddOns,
              }
            : item,
        ),
      );
    } else {
      const nextId = `M${String(menuItems.length + 1).padStart(3, '0')}`;
      setMenuItems((items) => [
        ...items,
        {
          id: nextId,
          ...menuForm,
          imageUrl:
            menuForm.imageUrl ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
          price: Number(menuForm.price),
          addOns: parsedAddOns,
        },
      ]);
    }

    closeDrawer();
  };

  const handleSaveStaff = (event: React.FormEvent) => {
    event.preventDefault();

    if (drawerMode === 'edit' && editingId) {
      setStaffList((items) =>
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...staffForm,
                code: staffForm.code || item.code,
                pin: staffForm.pin || item.pin,
              }
            : item,
        ),
      );
    } else {
      const nextNumber = staffList.length + 1;
      const nextId = `S${String(nextNumber).padStart(3, '0')}`;
      setStaffList((items) => [
        ...items,
        {
          id: nextId,
          ...staffForm,
          code: staffForm.code || `EMP-${String(nextNumber).padStart(3, '0')}`,
          pin: staffForm.pin || '0000',
        },
      ]);
    }

    closeDrawer();
  };

  const handleSaveInventory = (event: React.FormEvent) => {
    event.preventDefault();

    if (drawerMode === 'edit' && editingId) {
      setInventoryItems((items) =>
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...inventoryForm,
                stock: Number(inventoryForm.stock),
                minStock: Number(inventoryForm.minStock),
                cost: Number(inventoryForm.cost),
              }
            : item,
        ),
      );
    } else {
      const nextId = `I${String(inventoryItems.length + 1).padStart(3, '0')}`;
      setInventoryItems((items) => [
        ...items,
        {
          id: nextId,
          ...inventoryForm,
          stock: Number(inventoryForm.stock),
          minStock: Number(inventoryForm.minStock),
          cost: Number(inventoryForm.cost),
        },
      ]);
    }

    closeDrawer();
  };

  const toggleStatus = (type: Section, id: string) => {
    if (type === 'menu') {
      setMenuItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item,
        ),
      );
    }

    if (type === 'staff') {
      setStaffList((items) =>
        items.map((item) =>
          item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item,
        ),
      );
    }

    if (type === 'inventory') {
      setInventoryItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item,
        ),
      );
    }
  };

  const removeItem = (type: Section, id: string) => {
    const ok = window.confirm('ต้องการลบรายการนี้ใช่ไหม?');
    if (!ok) return;

    if (type === 'menu') setMenuItems((items) => items.filter((item) => item.id !== id));
    if (type === 'staff') setStaffList((items) => items.filter((item) => item.id !== id));
    if (type === 'inventory') setInventoryItems((items) => items.filter((item) => item.id !== id));
  };

  const sectionTitle =
    activeSection === 'menu'
      ? 'Menu Management'
      : activeSection === 'staff'
        ? 'Staff Management'
        : 'Inventory Control';

  const sectionSubtitle =
    activeSection === 'menu'
      ? 'เพิ่ม แก้ไข ลบเมนู ตั้งราคา และจัดการ Add-ons'
      : activeSection === 'staff'
        ? 'จัดการพนักงาน ตำแหน่ง รหัสล็อกอิน และสถานะการทำงาน'
        : 'จัดการวัตถุดิบ จำนวนคงเหลือ หน่วย และแจ้งเตือนของใกล้หมด';

  return (
    <div className="ops-page">
      <style>{operationStyles}</style>

      <header className="ops-hero">
        <div>
          <div className="ops-eyebrow">BizFlow POS</div>
          <h1>Operation & Setup</h1>
          <p>พื้นที่จัดการข้อมูลร้านของคุณ: เมนู พนักงาน และสต็อก โดยไม่แตะ Analytics ของเพื่อน</p>
        </div>
      </header>

      <section className="ops-stats-grid">
        <button
          className={`ops-stat-card ${activeSection === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveSection('menu')}
        >
          <span className="ops-stat-icon">🍽️</span>
          <span className="ops-stat-label">เมนูที่เปิดขาย</span>
          <strong>{activeMenus}</strong>
          <small>จากทั้งหมด {menuItems.length} รายการ</small>
        </button>

        <button
          className={`ops-stat-card ${activeSection === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveSection('staff')}
        >
          <span className="ops-stat-icon">👥</span>
          <span className="ops-stat-label">พนักงาน Active</span>
          <strong>{activeStaff}</strong>
          <small>จากทั้งหมด {staffList.length} คน</small>
        </button>

        <button
          className={`ops-stat-card ${activeSection === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveSection('inventory')}
        >
          <span className="ops-stat-icon">📦</span>
          <span className="ops-stat-label">ของใกล้หมด</span>
          <strong>{lowStock}</strong>
          <small>ต้องตรวจสต็อก</small>
        </button>
      </section>

      <section className="ops-workspace">
        <div className="ops-section-header">
          <div>
            <h2>{sectionTitle}</h2>
            <p>{sectionSubtitle}</p>
          </div>

          <div className="ops-tabs">
            <button className={activeSection === 'menu' ? 'active' : ''} onClick={() => setActiveSection('menu')}>
              เมนู
            </button>
            <button className={activeSection === 'staff' ? 'active' : ''} onClick={() => setActiveSection('staff')}>
              พนักงาน
            </button>
            <button
              className={activeSection === 'inventory' ? 'active' : ''}
              onClick={() => setActiveSection('inventory')}
            >
              สต็อก
            </button>
          </div>
        </div>

        <div className="ops-toolbar">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ค้นหาชื่อ / รหัส / หมวดหมู่..."
            className="ops-search"
          />

          {activeSection === 'menu' && (
            <select value={menuCategory} onChange={(event) => setMenuCategory(event.target.value)}>
              {menuCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          )}

          {activeSection === 'staff' && (
            <select value={staffRole} onChange={(event) => setStaffRole(event.target.value)}>
              {staffRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          )}

          {activeSection === 'inventory' && (
            <>
              <select value={inventoryCategory} onChange={(event) => setInventoryCategory(event.target.value)}>
                {inventoryCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <select value={stockView} onChange={(event) => setStockView(event.target.value as 'all' | 'low')}>
                <option value="all">ทั้งหมด</option>
                <option value="low">เฉพาะใกล้หมด</option>
              </select>
            </>
          )}

          <button className="ops-secondary-btn" onClick={() => openCreateDrawer(activeSection)}>
            + เพิ่ม
          </button>
        </div>

        {activeSection === 'menu' && (
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>เมนู</th>
                  <th>หมวดหมู่</th>
                  <th>ราคา</th>
                  <th>Add-ons</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenu.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="ops-item-main">
                        <img src={item.imageUrl} alt={item.name} />
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td className="ops-money">฿{item.price.toLocaleString()}</td>
                    <td>
                      <div className="ops-chip-list">
                        {item.addOns.slice(0, 3).map((addOn) => (
                          <span className="ops-chip" key={addOn}>
                            {addOn}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <RowActions
                        onEdit={() => openEditDrawer('menu', item.id)}
                        onToggle={() => toggleStatus('menu', item.id)}
                        onDelete={() => removeItem('menu', item.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMenu.length === 0 && <EmptyState text="ไม่พบเมนูที่ค้นหา" />}
          </div>
        )}

        {activeSection === 'staff' && (
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>พนักงาน</th>
                  <th>ตำแหน่ง</th>
                  <th>รหัสล็อกอิน</th>
                  <th>PIN</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="ops-avatar-main">
                        <span>{item.name.slice(0, 1)}</span>
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ops-role">{item.role}</span>
                    </td>
                    <td className="ops-code">{item.code}</td>
                    <td className="ops-code">{item.pin}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <RowActions
                        onEdit={() => openEditDrawer('staff', item.id)}
                        onToggle={() => toggleStatus('staff', item.id)}
                        onDelete={() => removeItem('staff', item.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStaff.length === 0 && <EmptyState text="ไม่พบพนักงานที่ค้นหา" />}
          </div>
        )}

        {activeSection === 'inventory' && (
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>วัตถุดิบ</th>
                  <th>หมวดหมู่</th>
                  <th>คงเหลือ</th>
                  <th>ขั้นต่ำ</th>
                  <th>ต้นทุน/หน่วย</th>
                  <th>สถานะสต็อก</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const isLow = item.stock <= item.minStock;
                  const percent = Math.min(100, Math.round((item.stock / Math.max(item.minStock, 1)) * 100));

                  return (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <strong>{item.name}</strong>
                          <small className="ops-subtext">{item.id}</small>
                        </div>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <strong>{item.stock}</strong> {item.unit}
                      </td>
                      <td>
                        {item.minStock} {item.unit}
                      </td>
                      <td className="ops-money">฿{item.cost.toLocaleString()}</td>
                      <td>
                        <div className="ops-stock-cell">
                          <span className={`ops-stock-badge ${isLow ? 'low' : 'ok'}`}>
                            {isLow ? 'ใกล้หมด' : 'ปกติ'}
                          </span>
                          <div className="ops-progress">
                            <span style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <RowActions
                          onEdit={() => openEditDrawer('inventory', item.id)}
                          onToggle={() => toggleStatus('inventory', item.id)}
                          onDelete={() => removeItem('inventory', item.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredInventory.length === 0 && <EmptyState text="ไม่พบวัตถุดิบที่ค้นหา" />}
          </div>
        )}
      </section>

      {drawerType && (
        <div className="ops-drawer-overlay" onMouseDown={closeDrawer}>
          <aside className="ops-drawer" onMouseDown={(event) => event.stopPropagation()}>
            <div className="ops-drawer-header">
              <div>
                <small>{drawerMode === 'edit' ? 'Edit Data' : 'Create New'}</small>
                <h3>
                  {drawerType === 'menu' && 'จัดการเมนู'}
                  {drawerType === 'staff' && 'จัดการพนักงาน'}
                  {drawerType === 'inventory' && 'จัดการสต็อก'}
                </h3>
              </div>
              <button onClick={closeDrawer}>×</button>
            </div>

            {drawerType === 'menu' && (
              <form className="ops-form" onSubmit={handleSaveMenu}>
                <label>
                  ชื่อเมนู
                  <input
                    required
                    value={menuForm.name}
                    onChange={(event) => setMenuForm({ ...menuForm, name: event.target.value })}
                    placeholder="เช่น ชาไทย"
                  />
                </label>

                <label>
                  หมวดหมู่
                  <select
                    value={menuForm.category}
                    onChange={(event) => setMenuForm({ ...menuForm, category: event.target.value })}
                  >
                    {menuCategories
                      .filter((category) => category !== 'ทั้งหมด')
                      .map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                  </select>
                </label>

                <label>
                  ราคา
                  <input
                    required
                    type="number"
                    min="0"
                    value={menuForm.price}
                    onChange={(event) => setMenuForm({ ...menuForm, price: Number(event.target.value) })}
                  />
                </label>

                <label>
                  รูปภาพ URL
                  <input
                    value={menuForm.imageUrl}
                    onChange={(event) => setMenuForm({ ...menuForm, imageUrl: event.target.value })}
                    placeholder="https://..."
                  />
                </label>

                <label>
                  Add-ons คั่นด้วย comma
                  <input
                    value={addOnText}
                    onChange={(event) => setAddOnText(event.target.value)}
                    placeholder="เพิ่มไข่ดาว, หวานน้อย, เพิ่มชีส"
                  />
                </label>

                <label>
                  สถานะ
                  <select
                    value={menuForm.status}
                    onChange={(event) => setMenuForm({ ...menuForm, status: event.target.value as Status })}
                  >
                    <option value="active">เปิดขาย</option>
                    <option value="inactive">ปิดขาย</option>
                  </select>
                </label>

                <DrawerFooter onCancel={closeDrawer} />
              </form>
            )}

            {drawerType === 'staff' && (
              <form className="ops-form" onSubmit={handleSaveStaff}>
                <label>
                  ชื่อพนักงาน
                  <input
                    required
                    value={staffForm.name}
                    onChange={(event) => setStaffForm({ ...staffForm, name: event.target.value })}
                    placeholder="ชื่อ-นามสกุล"
                  />
                </label>

                <label>
                  ตำแหน่ง
                  <select
                    value={staffForm.role}
                    onChange={(event) => setStaffForm({ ...staffForm, role: event.target.value })}
                  >
                    {staffRoles
                      .filter((role) => role !== 'ทั้งหมด')
                      .map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                  </select>
                </label>

                <label>
                  รหัสพนักงาน
                  <input
                    value={staffForm.code}
                    onChange={(event) => setStaffForm({ ...staffForm, code: event.target.value })}
                    placeholder="เว้นว่างเพื่อสร้างอัตโนมัติ"
                  />
                </label>

                <label>
                  PIN / Password เริ่มต้น
                  <input
                    value={staffForm.pin}
                    onChange={(event) => setStaffForm({ ...staffForm, pin: event.target.value })}
                    placeholder="เช่น 1234"
                  />
                </label>

                <label>
                  สถานะ
                  <select
                    value={staffForm.status}
                    onChange={(event) => setStaffForm({ ...staffForm, status: event.target.value as Status })}
                  >
                    <option value="active">ใช้งาน</option>
                    <option value="inactive">ปิดใช้งาน</option>
                  </select>
                </label>

                <DrawerFooter onCancel={closeDrawer} />
              </form>
            )}

            {drawerType === 'inventory' && (
              <form className="ops-form" onSubmit={handleSaveInventory}>
                <label>
                  ชื่อวัตถุดิบ
                  <input
                    required
                    value={inventoryForm.name}
                    onChange={(event) => setInventoryForm({ ...inventoryForm, name: event.target.value })}
                    placeholder="เช่น ไข่ไก่"
                  />
                </label>

                <label>
                  หมวดหมู่
                  <select
                    value={inventoryForm.category}
                    onChange={(event) => setInventoryForm({ ...inventoryForm, category: event.target.value })}
                  >
                    {inventoryCategories
                      .filter((category) => category !== 'ทั้งหมด')
                      .map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                  </select>
                </label>

                <div className="ops-form-grid">
                  <label>
                    คงเหลือ
                    <input
                      required
                      type="number"
                      min="0"
                      value={inventoryForm.stock}
                      onChange={(event) => setInventoryForm({ ...inventoryForm, stock: Number(event.target.value) })}
                    />
                  </label>

                  <label>
                    หน่วย
                    <input
                      required
                      value={inventoryForm.unit}
                      onChange={(event) => setInventoryForm({ ...inventoryForm, unit: event.target.value })}
                    />
                  </label>
                </div>

                <div className="ops-form-grid">
                  <label>
                    ขั้นต่ำ
                    <input
                      required
                      type="number"
                      min="0"
                      value={inventoryForm.minStock}
                      onChange={(event) =>
                        setInventoryForm({ ...inventoryForm, minStock: Number(event.target.value) })
                      }
                    />
                  </label>

                  <label>
                    ต้นทุนต่อหน่วย
                    <input
                      required
                      type="number"
                      min="0"
                      value={inventoryForm.cost}
                      onChange={(event) => setInventoryForm({ ...inventoryForm, cost: Number(event.target.value) })}
                    />
                  </label>
                </div>

                <label>
                  สถานะ
                  <select
                    value={inventoryForm.status}
                    onChange={(event) => setInventoryForm({ ...inventoryForm, status: event.target.value as Status })}
                  >
                    <option value="active">ใช้งาน</option>
                    <option value="inactive">ปิดใช้งาน</option>
                  </select>
                </label>

                <DrawerFooter onCancel={closeDrawer} />
              </form>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={`ops-status ${status}`}>{status === 'active' ? 'Active' : 'Inactive'}</span>;
}

function RowActions({
  onEdit,
  onToggle,
  onDelete,
}: {
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="ops-actions">
      <button onClick={onEdit}>แก้ไข</button>
      <button onClick={onToggle}>เปิด/ปิด</button>
      <button className="danger" onClick={onDelete}>
        ลบ
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="ops-empty">
      <div>🔎</div>
      <p>{text}</p>
    </div>
  );
}

function DrawerFooter({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="ops-drawer-footer">
      <button type="button" className="ops-cancel-btn" onClick={onCancel}>
        ยกเลิก
      </button>
      <button type="submit" className="ops-primary-btn">
        บันทึก
      </button>
    </div>
  );
}

const operationStyles = `
.ops-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: var(--text-main);
}

.ops-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 28px;
  border: 1px solid var(--border-light);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.12), transparent 34%),
    linear-gradient(135deg, var(--bg-card), var(--bg-surface));
  box-shadow: var(--shadow-sm);
}

.ops-eyebrow {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.ops-hero h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
  font-weight: 900;
}

.ops-hero p {
  margin: 10px 0 0;
  color: var(--text-muted);
  max-width: 680px;
}

.ops-primary-btn,
.ops-secondary-btn,
.ops-cancel-btn {
  border: 0;
  border-radius: 14px;
  padding: 11px 16px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s, opacity 0.18s, border-color 0.18s;
  white-space: nowrap;
}

.ops-primary-btn {
  background: var(--accent, #2563eb);
  color: white;
}

.ops-secondary-btn {
  background: var(--text-main);
  color: var(--bg-card);
}

.ops-cancel-btn {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border-light);
}

.ops-primary-btn:hover,
.ops-secondary-btn:hover,
.ops-cancel-btn:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}

.ops-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.ops-stat-card {
  text-align: left;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  color: var(--text-main);
  transition: 0.2s;
}

.ops-stat-card:hover,
.ops-stat-card.active {
  border-color: var(--accent, #2563eb);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.ops-stat-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 12px;
}

.ops-stat-label {
  display: block;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 700;
}

.ops-stat-card strong {
  display: block;
  font-size: 32px;
  margin: 6px 0;
}

.ops-stat-card small {
  color: var(--text-muted);
}

.ops-workspace {
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  border-radius: 24px;
  padding: 22px;
  box-shadow: var(--shadow-sm);
}

.ops-section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.ops-section-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
}

.ops-section-header p {
  margin: 6px 0 0;
  color: var(--text-muted);
}

.ops-tabs {
  display: inline-flex;
  padding: 4px;
  gap: 4px;
  border-radius: 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
}

.ops-tabs button {
  border: 0;
  background: transparent;
  color: var(--text-muted);
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}

.ops-tabs button.active {
  background: var(--bg-card);
  color: var(--text-main);
  box-shadow: var(--shadow-sm);
}

.ops-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.ops-search {
  flex: 1;
  min-width: 240px;
}

.ops-toolbar input,
.ops-toolbar select,
.ops-form input,
.ops-form select {
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-main);
  padding: 0 12px;
  outline: none;
}

.ops-toolbar input:focus,
.ops-toolbar select:focus,
.ops-form input:focus,
.ops-form select:focus {
  border-color: var(--accent, #2563eb);
}

.ops-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border-light);
  border-radius: 18px;
}

.ops-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 920px;
}

.ops-table th {
  text-align: left;
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 14px 16px;
  background: var(--bg-surface);
}

.ops-table td {
  padding: 14px 16px;
  border-top: 1px solid var(--border-light);
  vertical-align: middle;
}

.ops-item-main,
.ops-avatar-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ops-item-main img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid var(--border-light);
}

.ops-item-main small,
.ops-avatar-main small,
.ops-subtext {
  display: block;
  color: var(--text-muted);
  margin-top: 3px;
}

.ops-avatar-main span {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 900;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
}

.ops-money,
.ops-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 800;
}

.ops-chip-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ops-chip,
.ops-role {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: 800;
  background: var(--bg-surface);
  color: var(--text-main);
  border: 1px solid var(--border-light);
}

.ops-status {
  display: inline-flex;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 900;
}

.ops-status.active {
  color: #16a34a;
  background: rgba(34, 197, 94, 0.12);
}

.ops-status.inactive {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.12);
}

.ops-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ops-actions button {
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-main);
  border-radius: 10px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.ops-actions button.danger {
  color: #ef4444;
}

.ops-stock-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ops-stock-badge {
  font-size: 12px;
  font-weight: 900;
}

.ops-stock-badge.ok {
  color: #16a34a;
}

.ops-stock-badge.low {
  color: #f59e0b;
}

.ops-progress {
  height: 7px;
  width: 120px;
  border-radius: 999px;
  background: var(--bg-surface);
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.ops-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--accent, #2563eb);
}

.ops-empty {
  padding: 34px;
  text-align: center;
  color: var(--text-muted);
}

.ops-empty div {
  font-size: 32px;
}

.ops-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: flex-end;
}

.ops-drawer {
  width: min(520px, 100%);
  height: 100%;
  background: var(--bg-card);
  color: var(--text-main);
  box-shadow: -20px 0 80px rgba(0, 0, 0, 0.3);
  padding: 24px;
  overflow-y: auto;
  animation: opsSlideIn 0.22s ease-out;
}

@keyframes opsSlideIn {
  from { transform: translateX(24px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.ops-drawer-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 22px;
}

.ops-drawer-header small {
  color: var(--text-muted);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ops-drawer-header h3 {
  margin: 6px 0 0;
  font-size: 24px;
}

.ops-drawer-header button {
  border: 1px solid var(--border-light);
  background: var(--bg-surface);
  color: var(--text-main);
  width: 40px;
  height: 40px;
  border-radius: 14px;
  font-size: 24px;
  cursor: pointer;
}

.ops-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ops-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 800;
}

.ops-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ops-drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 14px;
  margin-top: 8px;
  border-top: 1px solid var(--border-light);
}

@media (max-width: 900px) {
  .ops-hero,
  .ops-section-header {
    flex-direction: column;
  }

  .ops-stats-grid {
    grid-template-columns: 1fr;
  }

  .ops-tabs {
    width: 100%;
  }

  .ops-tabs button {
    flex: 1;
  }

  .ops-form-grid {
    grid-template-columns: 1fr;
  }
}
`;
