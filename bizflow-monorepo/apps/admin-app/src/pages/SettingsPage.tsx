import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', animation: 'pageEnter 0.5s ease-out forwards' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>⚙️</span> Settings
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>
          จัดการข้อมูลส่วนตัว ตั้งค่าความปลอดภัย และระบบของร้าน
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        
        {/* เมนูตั้งค่าด้านซ้าย */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'profile' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'profile' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span>👤</span> My Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'security' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'security' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span>🔒</span> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'notifications' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'notifications' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span>🔔</span> Notifications
          </button>
        </div>

        {/* เนื้อหาการตั้งค่าด้านขวา */}
        <div className="card" style={{ padding: '32px' }}>
          
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>ข้อมูลส่วนตัว (Personal Info)</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>A</div>
                <div>
                  <button className="btn-outline" style={{ marginBottom: '8px' }}>อัปโหลดรูปภาพ</button>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>รองรับ JPG, PNG ขนาดไม่เกิน 2MB</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>ชื่อ-นามสกุล</label>
                  <input type="text" className="input-field" defaultValue="Admin BizFlow" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>อีเมล</label>
                  <input type="email" className="input-field" defaultValue="admin@bizflow.com" readOnly style={{ opacity: 0.7 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>เบอร์โทรศัพท์</label>
                  <input type="text" className="input-field" defaultValue="089-123-4567" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>ตำแหน่ง</label>
                  <input type="text" className="input-field" defaultValue="CEO / Founder" readOnly style={{ opacity: 0.7 }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button className="quick-action-btn primary" onClick={() => alert('บันทึกข้อมูลเรียบร้อย!')}>บันทึกการเปลี่ยนแปลง</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>เปลี่ยนรหัสผ่าน (Change Password)</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>รหัสผ่านปัจจุบัน</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>รหัสผ่านใหม่</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>ยืนยันรหัสผ่านใหม่</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button className="quick-action-btn primary">อัปเดตรหัสผ่าน</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>การแจ้งเตือน (Notifications)</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>แจ้งเตือนยอดขายรายวัน</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ส่งสรุปยอดขายไปที่อีเมลทุกวันเวลา 22:00 น.</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>แจ้งเตือนสต็อกใกล้หมด</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>แจ้งเตือนเมื่อวัตถุดิบลดลงถึงจุดสั่งซื้อขั้นต่ำ</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }} />
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}