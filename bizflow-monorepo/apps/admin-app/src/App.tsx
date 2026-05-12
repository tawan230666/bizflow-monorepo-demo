import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import FinancePage from './pages/FinancePage';
import ReportPage from './pages/ReportPage';
import MenuPage from './pages/MenuPage';
import './App.css';

// 1. สร้าง Layout สำหรับแอปหลัก (ที่มี Sidebar & Topbar)
function DashboardLayout({ isDarkMode, setIsDarkMode }: any) {
  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand-logo">
          <span style={{ color: 'var(--accent)', marginRight: '4px' }}>Biz</span>Flow
        </div>
        
        <nav className="nav-menu">
          <div className="sidebar-label">Dashboards</div>
          <NavLink to="/overview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>⊞</span> Dashboard
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
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-wrapper">
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

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// 2. จัดการ Routing
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

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
        <Route path="/login" element={<LoginPage />} />

        <Route element={<DashboardLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}>
          {/* ลิงก์เริ่มต้น */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* หน้าทั้งหมดที่มี */}
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/report" element={<ReportPage />} />
          
          {/* ตัวกันตาย: ถ้าผู้ใช้เข้า URL ที่ไม่มีอยู่จริง ให้เด้งกลับมาหน้า Overview */}
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}