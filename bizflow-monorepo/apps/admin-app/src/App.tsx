import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/analytics/OverviewPage';
import FinancePage from './pages/analytics/FinancePage';
import ReportPage from './pages/analytics/ReportPage';
import MenuPage from './pages/MenuPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function DashboardLayout({ isDarkMode, setIsDarkMode }: any) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // 🚀 State สำหรับดึงข้อมูลโปรไฟล์ (รูปภาพ, ชื่อ, อีเมล) จาก LocalStorage
  const [globalProfileImg, setGlobalProfileImg] = useState<string | null>(localStorage.getItem('bizflow_profile_img'));
  const [globalName, setGlobalName] = useState<string>(localStorage.getItem('bizflow_profile_name') || 'Admin BizFlow');
  const [globalEmail, setGlobalEmail] = useState<string>(localStorage.getItem('bizflow_profile_email') || 'admin@bizflow.com');

  // ดักจับ Event 'profile_updated' (ที่ส่งมาจากหน้า Settings)
  useEffect(() => {
    const handleProfileUpdate = () => {
      setGlobalProfileImg(localStorage.getItem('bizflow_profile_img'));
      setGlobalName(localStorage.getItem('bizflow_profile_name') || 'Admin BizFlow');
      setGlobalEmail(localStorage.getItem('bizflow_profile_email') || 'admin@bizflow.com');
    };
    window.addEventListener('profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('profile_updated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bizflow_session');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar" style={{ background: 'var(--bg-surface)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        
        <div className="brand-logo" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text-main)' }}>
          Biz<span style={{ color: 'var(--accent)' }}>Flow</span>
        </div>

        <nav className="nav-menu" style={{ flex: 1 }}>
          <div className="sidebar-label">Executive</div>
          <NavLink to="/overview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>⊞</span> Overview
          </NavLink>
          <NavLink to="/finance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>💰</span> Finance & Accounting
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>🏪</span> Franchise / Branch Management
          </NavLink>
          <NavLink to="/report" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>📣</span> Marketing & CRM
          </NavLink>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)' }}>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>⚙️</span> Settings
          </NavLink>
        </div>
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

            {/* เมนูรูปโปรไฟล์มุมขวาบน */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', 
                  cursor: 'pointer', border: '2px solid transparent', transition: '0.2s',
                  borderColor: isProfileOpen ? 'rgba(99, 102, 241, 0.5)' : 'transparent',
                  overflow: 'hidden'
                }}
              >
                {/* 🚀 ถ้ามีรูปแสดงรูป ถ้าไม่มีแสดงตัวอักษรตัวแรกของชื่อ */}
                {globalProfileImg ? (
                  <img src={globalProfileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  globalName.charAt(0).toUpperCase()
                )}
              </div>

              {/* Popup Dropdown */}
              {isProfileOpen && (
                <div style={{
                  position: 'absolute', top: '50px', right: '0', width: '240px',
                  background: 'var(--bg-card)', border: '1px solid var(--border-light)', 
                  borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  padding: '8px', zIndex: 100, animation: 'pageEnter 0.2s ease-out'
                }}>
                  
                  {/* 🚀 ข้อมูลโปรไฟล์ใน Dropdown ดึงจากค่าที่ตั้งไว้ */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', marginBottom: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                      {globalProfileImg ? <img src={globalProfileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : globalName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{globalName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{globalEmail}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', transition: '0.2s', display: 'flex', gap: '8px', alignItems: 'center' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>⚙️</span> Settings
                  </button>

                  <button 
                    onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--loss)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', transition: '0.2s', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--loss-bg)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>🚪</span> Sign out
                  </button>
                </div>
              )}
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
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}