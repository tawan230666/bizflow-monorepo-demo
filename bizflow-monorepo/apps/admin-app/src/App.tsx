import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/analytics/OverviewPage';
import FinancePage from './pages/analytics/FinancePage';
import ReportPage from './pages/analytics/ReportPage';
import MenuPage from './pages/MenuPage';
import './App.css';

function DashboardLayout({ isDarkMode, setIsDarkMode }: any) {
  return (
    <div className="admin-layout">
      {/* 👇 แก้ตรงนี้: เปลี่ยน background เป็น var(--bg-surface) เพื่อให้สลับสีขาว/ดำ อัตโนมัติ */}
      <aside className="sidebar" style={{ background: 'var(--bg-surface)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--border)' }}>
        
        {/* 👇 แก้ตรงนี้: เพิ่ม color: 'var(--text-main)' ให้คำว่า Biz เปลี่นสีตามธีม */}
        <div className="brand-logo" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text-main)' }}>
          Biz<span style={{ color: 'var(--accent)' }}>Flow</span>
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
            <span style={{ fontSize: '18px' }}>💰</span> Finance
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>🍽️</span> Menu
          </NavLink>
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)' }} />
          </div>
          <div className="topbar-actions">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="btn-outline" title="Toggle Dark/Light Mode">
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
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
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}