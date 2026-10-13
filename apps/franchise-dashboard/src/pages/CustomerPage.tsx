import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const customers = [
  { id: 'C001', name: 'พี่อั้ม', branch: 'bkk', email: 'aum@example.com', phone: '089-123-4567', visits: 12, total: 5240, favorite: 'ชาเย็น', status: 'Active' },
  { id: 'C002', name: 'น้องเมย์', branch: 'bkk', email: 'may@example.com', phone: '089-234-5678', visits: 9, total: 3420, favorite: 'กะเพราหมูกรอบ', status: 'Active' },
  { id: 'C003', name: 'คุณต้อม', branch: 'cnx', email: 'tom@example.com', phone: '089-345-6789', visits: 6, total: 2150, favorite: 'ต้มยำกุ้ง', status: 'At Risk' },
  { id: 'C004', name: 'คุณนิด', branch: 'cnx', email: 'nid@example.com', phone: '089-456-7890', visits: 4, total: 1320, favorite: 'ชาเย็น', status: 'Active' },
  { id: 'C005', name: 'คุณหนุ่ม', branch: 'hkt', email: 'noom@example.com', phone: '089-567-8901', visits: 15, total: 8430, favorite: 'หมึกย่าง', status: 'Loyal' },
  { id: 'C006', name: 'คุณแพรว', branch: 'hkt', email: 'praew@example.com', phone: '089-678-9012', visits: 11, total: 5700, favorite: 'ผัดไทย', status: 'Active' },
];

const orders = [
  { id: 'O-1072', customerId: 'C005', date: '12 พ.ค. 2026', amount: 520, item: 'หมึกย่าง' },
  { id: 'O-1068', customerId: 'C005', date: '11 พ.ค. 2026', amount: 720, item: 'ชาเย็น' },
  { id: 'O-1042', customerId: 'C005', date: '09 พ.ค. 2026', amount: 1280, item: 'ชุดหมึกย่างพิเศษ' },
  { id: 'O-1037', customerId: 'C005', date: '08 พ.ค. 2026', amount: 980, item: 'ข้าวผัดปู' },
];

export default function CustomerPage() {
  const { customerId } = useParams<{ customerId?: string }>();
  const navigate = useNavigate();
  const customer = useMemo(
    () => customers.find((item) => item.id === customerId) || customers[0],
    [customerId]
  );

  const customerOrders = orders.filter((order) => order.customerId === customer.id);

  return (
    <div className="page-container">
      <div className="page-header" style={{ alignItems: 'flex-start', gap: '20px' }}>
        <div>
          <h2>👤 ข้อมูลลูกค้า</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>
            ดูรายละเอียดและประวัติการสั่งซื้อของลูกค้าแต่ละคน.
          </p>
        </div>
        <button className="btn-outline" onClick={() => navigate(-1)}>
          กลับ
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ลูกค้า</div>
              <h3 style={{ margin: '8px 0 0', fontSize: '24px' }}>{customer.name}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(103,232,249,0.14)', color: 'var(--accent)', fontWeight: 700 }}>{customer.name.charAt(0)}</div>
          </div>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div><strong>รหัสลูกค้า:</strong> {customer.id}</div>
            <div><strong>สาขา:</strong> {customer.branch === 'bkk' ? 'กรุงเทพฯ (HQ)' : customer.branch === 'cnx' ? 'เชียงใหม่' : 'ภูเก็ต'}</div>
            <div><strong>อีเมล:</strong> {customer.email}</div>
            <div><strong>โทรศัพท์:</strong> {customer.phone}</div>
            <div><strong>สถานะ:</strong> <span style={{ color: customer.status === 'At Risk' ? 'var(--warning)' : customer.status === 'Loyal' ? 'var(--profit)' : 'var(--text-main)' }}>{customer.status}</span></div>
            <div><strong>จำนวนครั้งเข้าใช้:</strong> {customer.visits}</div>
            <div><strong>ยอดใช้รวม:</strong> ฿{customer.total.toLocaleString()}</div>
            <div><strong>เมนูโปรด:</strong> {customer.favorite}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', background: 'rgba(34, 197, 94, 0.08)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--profit)' }}>Action Suggestion</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            ลูกค้าท่านนี้ชอบเมนู {customer.favorite}. แนะนำให้ส่งโปรโมชั่นส่วนลด {customer.status === 'At Risk' ? '10%' : '5%'} สำหรับการสั่งครั้งถัดไป เพื่อกระตุ้นการกลับมาใช้บริการ.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>ประวัติการสั่งซื้อ</h3>
        </div>
        <table className="modern-table">
          <thead>
            <tr>
              <th>เลขที่เอกสาร</th>
              <th>รายการ</th>
              <th style={{ textAlign: 'center' }}>วันที่</th>
              <th style={{ textAlign: 'right' }}>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {customerOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.item}</td>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{order.date}</td>
                <td className="mono" style={{ textAlign: 'right', color: 'var(--text-main)', fontWeight: 600 }}>฿{order.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
