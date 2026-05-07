import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import EmployeePage from './pages/EmployeePage';
import FinancePage from './pages/FinancePage';
import ReportPage from './pages/ReportPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="admin-layout">
        {/* แถบเมนูด้านซ้าย */}
        <aside className="sidebar">
          <h1>BizAdmin</h1>
          <nav>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              👥 จัดการพนักงาน
            </NavLink>
            <NavLink 
              to="/finance" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              💰 งบกำไรขาดทุน
            </NavLink>
            <NavLink 
              to="/report" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              📈 สรุปรายงาน
            </NavLink>
          </nav>
        </aside>

        {/* พื้นที่แสดงเนื้อหาหลัก */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<EmployeePage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;