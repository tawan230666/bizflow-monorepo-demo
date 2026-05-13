import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const branches = {
  bkk: { name: 'กรุงเทพฯ (HQ)', sales: 12450, orders: 84, customers: 142, profit: 4100, churn: 3.2 },
  cnx: { name: 'เชียงใหม่', sales: 8200, orders: 45, customers: 89, profit: 2500, churn: 4.5 },
  hkt: { name: 'ภูเก็ต', sales: 15600, orders: 112, customers: 210, profit: 5800, churn: 2.1 },
};

const customerRecords = [
  { id: 'C001', name: 'พี่อั้ม', branch: 'bkk', visits: 12, total: 5240, status: 'Active' },
  { id: 'C002', name: 'น้องเมย์', branch: 'bkk', visits: 9, total: 3420, status: 'Active' },
  { id: 'C003', name: 'คุณต้อม', branch: 'cnx', visits: 6, total: 2150, status: 'At Risk' },
  { id: 'C004', name: 'คุณนิด', branch: 'cnx', visits: 4, total: 1320, status: 'Active' },
  { id: 'C005', name: 'คุณหนุ่ม', branch: 'hkt', visits: 15, total: 8430, status: 'Loyal' },
  { id: 'C006', name: 'คุณแพรว', branch: 'hkt', visits: 11, total: 5700, status: 'Active' },
];

export default function BranchReportPage() {
  const { branchId } = useParams<{ branchId?: string }>();
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(branchId || 'bkk');

  useEffect(() => {
    if (branchId && branches[branchId]) {
      setSelectedBranch(branchId);
    }
  }, [branchId]);

  const summary = branches[selectedBranch];
  const branchCustomers = useMemo(
    () => customerRecords.filter((customer) => customer.branch === selectedBranch),
    [selectedBranch]
  );

  return (
    <div className="page-container">
      <div className="page-header" style={{ alignItems: 'flex-start', gap: '20px' }}>
        <div>
          <h2>🏪 รายงานสาขา</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>
            ดูสรุปผลแต่ละสาขาพร้อมเชื่อมต่อข้อมูลลูกค้าเพื่อวิเคราะห์พฤติกรรม
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/report" className="btn-outline">กลับสู่รายงาน</Link>
          <button className="btn-outline" onClick={() => navigate(`/customer/${branchCustomers[0]?.id || 'C001'}`)}>
            ดูลูกค้าเด่นของสาขา
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <div style={{ minWidth: '260px', flex: '1 1 260px' }}>
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', gap: '12px' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  เลือกสาขา
                </div>
                <select
                  value={selectedBranch}
                  onChange={(event) => setSelectedBranch(event.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {Object.entries(branches).map(([key, branch]) => (
                    <option key={key} value={key}>{branch.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', flex: '2 1 500px' }}>
          <div className="card">
            <div className="kpi-title">ยอดขายวันนี้</div>
            <div className="kpi-value mono">฿{summary.sales.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="kpi-title">คำสั่งซื้อ</div>
            <div className="kpi-value mono">{summary.orders}</div>
          </div>
          <div className="card">
            <div className="kpi-title">ลูกค้าที่ดูแล</div>
            <div className="kpi-value mono">{summary.customers}</div>
          </div>
          <div className="card" style={{ background: 'var(--profit-bg)', borderColor: 'rgba(34,197,94,0.2)' }}>
            <div className="kpi-title" style={{ color: 'var(--profit)' }}>กำไร</div>
            <div className="kpi-value mono" style={{ color: 'var(--profit)' }}>฿{summary.profit.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>รายชื่อลูกค้าสาขา {summary.name}</h3>
        </div>
        <table className="modern-table">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th style={{ textAlign: 'center' }}>จำนวนครั้งเข้าใช้</th>
              <th style={{ textAlign: 'right' }}>ยอดใช้ไป</th>
              <th style={{ textAlign: 'center' }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {branchCustomers.map((customer) => (
              <tr key={customer.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/customer/${customer.id}`)}>
                <td>{customer.id}</td>
                <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{customer.name}</td>
                <td className="mono" style={{ textAlign: 'center' }}>{customer.visits}</td>
                <td className="mono" style={{ textAlign: 'right' }}>฿{customer.total.toLocaleString()}</td>
                <td style={{ textAlign: 'center', color: customer.status === 'At Risk' ? 'var(--warning)' : customer.status === 'Loyal' ? 'var(--profit)' : 'var(--text-main)', fontWeight: 700 }}>
                  {customer.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: 'var(--text-main)' }}>Customer Insights</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '12px' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>ลูกค้าเฉลี่ยต่อวัน</span>
              <strong>{Math.round(summary.customers / 5)} คน</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Customer churn rate</span>
              <strong>{summary.churn}%</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>ลูกค้าจงรักภักดี</span>
              <strong>{branchCustomers.filter((item) => item.status === 'Loyal').length} คน</strong>
            </li>
          </ul>
        </div>
        <div style={{ padding: '24px', background: 'rgba(103, 232, 249, 0.05)', borderRadius: '18px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: 'var(--text-main)' }}>Action Plan</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            สำหรับสาขา {summary.name} ควรเพิ่มโปรโมชั่นลูกค้าประจำ และติดตามลูกค้ากลุ่ม "At Risk" เพื่อเพิ่ม retention.
          </p>
        </div>
      </div>
    </div>
  );
}
