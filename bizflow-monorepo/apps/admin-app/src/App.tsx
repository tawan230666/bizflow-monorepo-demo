import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import EmployeePage from './pages/EmployeePage';
import FinancePage from './pages/FinancePage';
import ReportPage from './pages/ReportPage';
import OverviewPage from './pages/OverviewPage';
import './App.css';

function App() {
  // สร้าง State สำหรับควบคุมโหมดมืด/สว่าง (เริ่มต้นเป็น Dark)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // ดักจับการเปลี่ยนแปลง: ถ้ากดเปลี่ยน ให้เพิ่มหรือลบ class "light-mode" ที่แท็ก <body>
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="admin-layout">
        <aside className="sidebar">
          <div className="brand-logo">
            <span className="gradient-text">Biz</span>Flow
          </div>

          <nav style={{ flex: 1 }}>
            <div className="sidebar-label">Dashboards</div>
            <NavLink to="/overview" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span style={{ fontSize: '16px' }}>⌘</span> Overview
            </NavLink>
            <NavLink to="/report" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span style={{ fontSize: '16px' }}>◱</span> Reports
            </NavLink>

            <div className="sidebar-label" style={{ marginTop: '24px' }}>Management</div>
            <NavLink to="/employee" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span style={{ fontSize: '16px' }}>⚇</span> Staff & Roles
            </NavLink>
            <NavLink to="/finance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span style={{ fontSize: '16px' }}>⎍</span> Finance
            </NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
              A
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>Admin User</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Owner</div>
            </div>
            
            {/* ปุ่มกดสลับโหมด 🌙 / ☀️ */}
            <button 
              className="logout-btn" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;