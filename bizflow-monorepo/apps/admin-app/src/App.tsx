import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import EmployeePage from './pages/EmployeePage';
import FinancePage from './pages/FinancePage';
import ReportPage from './pages/ReportPage';
import MenuPage from './pages/MenuPage';
import './App.css';

// ==========================================
// 1. Layout ของระบบหลังบ้าน (มี Sidebar + Topbar)
// ==========================================
function DashboardLayout({ isDarkMode, setIsDarkMode }: any) {
  return (
    <div className="admin-layout">
      {/* ฝั่งซ้าย: SIDEBAR */}
      <aside className="sidebar">
        <div className="brand-logo">
          <span style={{ color: 'var(--accent)', marginRight: '4px' }}>Biz</span>Flow
        </div>
        
        <nav className="nav-menu">
          <div className="sidebar-label">Dashboards</div>
          <NavLink to="/overview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>⊞</span> Overview
          </NavLink>
          <NavLink to="/report" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>📈</span> Analytics
          </NavLink>
          
          <div className="sidebar-label" style={{ marginTop: '16px' }}>Management</div>
          <NavLink to="/finance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>💰</span> Deals
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>🍽️</span> Menu
          </NavLink>
          <NavLink to="/employee" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>👥</span> Team
          </NavLink>
        </nav>
      </aside>

      {/* ฝั่งขวา: พื้นที่ทำงานหลัก */}
      <div className="main-wrapper">
        
        {/* แถบด้านบน: TOPBAR */}
        <header className="topbar">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search..." />
          </div>
          
          <div className="topbar-actions">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="btn-outline"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--text-main)', color: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              A
            </div>
          </div>
        </header>

        {/* เนื้อหาหน้าเพจ: CONTENT */}
        <main className="main-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

// ==========================================
// 2. ระบบ Routing สลับหน้าจอ
// ==========================================
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // สลับโหมดสี
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* หน้า Login แบบเต็มจอ (ไม่มี Layout) */}
        <Route path="/login" element={<LoginPage />} />

        {/* หน้าอื่นๆ ใช้ DashboardLayout คลุมทั้งหมด */}
        <Route element={<DashboardLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/report" element={<ReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}