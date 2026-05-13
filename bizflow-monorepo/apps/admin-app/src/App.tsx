import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/analytics/OverviewPage';
import FinancePage from './pages/analytics/FinancePage';
import ReportPage from './pages/analytics/ReportPage';
import MenuPage from './pages/MenuPage';
import SettingsPage from './pages/SettingsPage';
import BranchAccountsPage from './pages/BranchAccountsPage';
import './App.css';

function DashboardLayout({ isDarkMode, setIsDarkMode }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // State & Ref สำหรับทำเอฟเฟกต์เลื่อนเมนู (Sliding Pill)
  const sidebarRef = useRef<HTMLElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ top: 0, left: 0, width: 0, height: 0, opacity: 0 });

  const isBranchActive = location.pathname === '/menu' || location.pathname === '/branch-accounts';
  const [isFranchiseOpen, setIsFranchiseOpen] = useState(isBranchActive);

  const [globalProfileImg, setGlobalProfileImg] = useState<string | null>(localStorage.getItem('bizflow_profile_img'));
  const [globalName, setGlobalName] = useState<string>(localStorage.getItem('bizflow_profile_name') || 'Admin BizFlow');
  const [globalEmail, setGlobalEmail] = useState<string>(localStorage.getItem('bizflow_profile_email') || 'admin@bizflow.com');

  useEffect(() => {
    const updateSliderPosition = () => {
      if (!sidebarRef.current) return;
      
      const activeLinks = Array.from(sidebarRef.current.querySelectorAll('a.active')) as HTMLElement[];
      if (activeLinks.length === 0) return;

      let targetLink = activeLinks[0];
      
      if (activeLinks.length > 1) {
        const subLink = activeLinks[activeLinks.length - 1];
        const subContainer = subLink.closest('.submenu-container');
        
        if (subContainer && subContainer.getBoundingClientRect().height > 10) {
          targetLink = subLink;
        }
      }

      const asideRect = sidebarRef.current.getBoundingClientRect();
      const linkRect = targetLink.getBoundingClientRect();
      
      setSliderStyle({
        top: linkRect.top - asideRect.top,
        left: linkRect.left - asideRect.left,
        width: linkRect.width,
        height: linkRect.height,
        opacity: 1
      });
    };

    let count = 0;
    const interval = setInterval(() => {
      updateSliderPosition();
      count++;
      if (count > 20) clearInterval(interval);
    }, 20);

    window.addEventListener('resize', updateSliderPosition);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateSliderPosition);
    };
  }, [location.pathname, isFranchiseOpen]);

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
      
      <style>{`
        .nav-link.active {
          background-color: transparent !important; 
        }
        .nav-link {
          position: relative;
          z-index: 1; 
        }
        .magic-slider {
          position: absolute;
          background-color: var(--accent-bg);
          border-radius: 10px;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s;
          z-index: 0;
          pointer-events: none; 
        }
        body.light-mode .magic-slider {
          background-color: #dbeafe;
        }
        body.light-mode .nav-link.active {
          color: #1e3a8a !important;
          font-weight: 700;
        }
        .sub-menu-link:hover {
          color: var(--text-main) !important;
        }
      `}</style>

      {/* SIDEBAR */}
      <aside 
        ref={sidebarRef}
        className="sidebar" 
        style={{ background: 'var(--bg-surface)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        
        <div 
          className="magic-slider" 
          style={{
            transform: `translate(${sliderStyle.left}px, ${sliderStyle.top}px)`,
            width: `${sliderStyle.width}px`,
            height: `${sliderStyle.height}px`,
            opacity: sliderStyle.opacity
          }}
        />

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

          {/* เมนู Franchise แบบคลิกเปิด/ปิด */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <NavLink 
              to="/menu" 
              onClick={(e) => {
                // 🚀 เปลี่ยนจาก (true) เป็น (!isFranchiseOpen) เพื่อให้สลับเปิด/ปิดได้
                setIsFranchiseOpen(!isFranchiseOpen); 
              }}
              className={({ isActive }) => `nav-link ${isActive || isBranchActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <span style={{ fontSize: '18px', marginRight: '12px' }}>🏪</span> 
              <span style={{ flex: 1 }}>Franchise / Branch Mgt</span>
              
              {/* ลูกศรสำหรับเปิด/ปิดเมนูย่อย */}
              <div 
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation(); // 🚀 ใส่ตัวห้าม Event Bubbling เพื่อไม่ให้คำสั่งไปชนกับตัวแม่
                  setIsFranchiseOpen(!isFranchiseOpen);
                }}
                style={{
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ 
                  fontSize: '10px', 
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isFranchiseOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
                }}>▼</span>
              </div>
            </NavLink>

            {/* ส่วนของเมนูย่อย */}
            <div 
              className="submenu-container"
              style={{
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                maxHeight: isFranchiseOpen ? '120px' : '0',
                opacity: isFranchiseOpen ? 1 : 0,
                paddingLeft: '38px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginTop: isFranchiseOpen ? '4px' : '0'
              }}
            >
              <NavLink 
                to="/menu" 
                className={({ isActive }) => `nav-link sub-menu-link ${isActive && location.pathname === '/menu' ? 'active' : ''}`}
                style={{ fontSize: '13px', padding: '8px 12px', minHeight: '36px', color: 'var(--text-muted)' }}
              >
                • จัดการเมนูอาหาร
              </NavLink>
              
              <NavLink 
                to="/branch-accounts" 
                className={({ isActive }) => `nav-link sub-menu-link ${isActive ? 'active' : ''}`}
                style={{ fontSize: '13px', padding: '8px 12px', minHeight: '36px', color: 'var(--text-muted)' }}
              >
                • จัดการบัญชีแต่ละสาขา
              </NavLink>
            </div>
          </div>

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
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              style={{
                position: 'relative',
                width: '84px', height: '38px', borderRadius: '20px',
                background: 'var(--bg-body)', border: '1px solid var(--border-light)',
                cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                transition: 'background 0.3s, border-color 0.3s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }}
              title="Toggle Theme"
            >
              <div style={{ position: 'relative', width: '18px', height: '18px' }}>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: isDarkMode ? 'translateY(24px) scale(0.5) rotate(-45deg)' : 'translateY(0) scale(1) rotate(0deg)', opacity: isDarkMode ? 0 : 1 }}>☀️</span>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: isDarkMode ? 'translateY(0) scale(1) rotate(0deg)' : 'translateY(24px) scale(0.5) rotate(45deg)', opacity: isDarkMode ? 1 : 0 }}>🌙</span>
              </div>
              <div style={{ position: 'relative', width: '36px', height: '18px', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: isDarkMode ? 'translateY(-24px)' : 'translateY(0)', opacity: isDarkMode ? 0 : 1 }}>Light</span>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: isDarkMode ? 'translateY(0)' : 'translateY(24px)', opacity: isDarkMode ? 1 : 0 }}>Dark</span>
              </div>
            </button>

            <div style={{ position: 'relative' }} ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', 
                  cursor: 'pointer', border: '2px solid transparent', transition: '0.2s',
                  borderColor: isProfileOpen ? 'rgba(99, 102, 241, 0.5)' : 'transparent', overflow: 'hidden'
                }}
              >
                {globalProfileImg ? (
                  <img src={globalProfileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  globalName.charAt(0).toUpperCase()
                )}
              </div>

              {isProfileOpen && (
                <div style={{ position: 'absolute', top: '50px', right: '0', width: '240px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', padding: '8px', zIndex: 100, animation: 'pageEnter 0.2s ease-out' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', marginBottom: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                      {globalProfileImg ? <img src={globalProfileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : globalName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{globalName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{globalEmail}</div>
                    </div>
                  </div>
                  <button onClick={() => { navigate('/settings'); setIsProfileOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', transition: '0.2s', display: 'flex', gap: '8px', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <span>⚙️</span> Settings
                  </button>
                  <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--loss)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', transition: '0.2s', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--loss-bg)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
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
          <Route path="/branch-accounts" element={<BranchAccountsPage />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}