import React, { useState, useRef } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // --- Profile State ---
  const savedImg = localStorage.getItem('bizflow_profile_img');
  const savedName = localStorage.getItem('bizflow_profile_name') || 'Admin BizFlow';
  const savedEmail = localStorage.getItem('bizflow_profile_email') || 'admin@bizflow.com';
  const savedPhone = localStorage.getItem('bizflow_profile_phone') || '089-123-4567';

  const [profileImage, setProfileImage] = useState<string | null>(savedImg);
  const [name, setName] = useState(savedName);
  const [email, setEmail] = useState(savedEmail);
  const [phone, setPhone] = useState(savedPhone);

  const [initialImage, setInitialImage] = useState<string | null>(savedImg);
  const [initialName, setInitialName] = useState(savedName);
  const [initialEmail, setInitialEmail] = useState(savedEmail);
  const [initialPhone, setInitialPhone] = useState(savedPhone);

  // --- 🚀 Security State (เพิ่มใหม่) ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // เช็คว่าหน้า Profile มีการแก้ไขไหม
  const isProfileDirty = name !== initialName || email !== initialEmail || phone !== initialPhone || profileImage !== initialImage;
  
  // เช็คว่าหน้า Security มีการแก้ไขไหม
  const isSecurityDirty = currentPassword !== '' || newPassword !== '' || confirmPassword !== '';

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({ title: '', desc: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ฟังก์ชันแสดง Toast
  const triggerToast = (title: string, desc: string) => {
    setToastMsg({ title, desc });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = () => {
    if (!isProfileDirty) return;
    localStorage.setItem('bizflow_profile_img', profileImage || '');
    localStorage.setItem('bizflow_profile_name', name);
    localStorage.setItem('bizflow_profile_email', email);
    localStorage.setItem('bizflow_profile_phone', phone);
    
    setInitialImage(profileImage);
    setInitialName(name);
    setInitialEmail(email);
    setInitialPhone(phone);

    window.dispatchEvent(new Event('profile_updated'));
    triggerToast('บันทึกสำเร็จ', 'ข้อมูลส่วนตัวของคุณถูกอัปเดตเรียบร้อยแล้ว');
  };

  // 🚀 ฟังก์ชันเปลี่ยนรหัสผ่าน
  const handleUpdatePassword = () => {
    if (!isSecurityDirty) return;

    // เช็คว่ากรอกครบไหม
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    // เช็ครหัสผ่านใหม่กับยืนยันตรงกันไหม
    if (newPassword !== confirmPassword) {
      alert('⚠️ รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    // จำลองการเซฟ (ในระบบจริงต้องส่งไป API)
    console.log('Password Updated:', newPassword);
    
    // เคลียร์ช่องกรอก
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    triggerToast('เปลี่ยนรหัสผ่านสำเร็จ', 'ระบบได้ทำการอัปเดตรหัสผ่านใหม่ของคุณแล้ว');
  };

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', animation: 'pageEnter 0.5s ease-out forwards', position: 'relative' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>⚙️</span> Settings
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>จัดการข้อมูลส่วนตัว ตั้งค่าความปลอดภัย และระบบของร้าน</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveTab('profile')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'profile' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'profile' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👤</span> My Profile
          </button>
          <button onClick={() => setActiveTab('security')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'security' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'security' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔒</span> Security
          </button>
          <button onClick={() => setActiveTab('notifications')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'notifications' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'notifications' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔔</span> Notifications
          </button>
        </div>

        {/* Content Card */}
        <div className="card" style={{ padding: '32px' }}>
          
          {/* --- TAB: PROFILE --- */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>ข้อมูลส่วนตัว (Personal Info)</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 800, overflow: 'hidden', border: '3px solid var(--border-light)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                  {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageChange} />
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                    <button className="btn-outline" onClick={() => fileInputRef.current?.click()}>อัปโหลดรูปภาพ</button>
                    {profileImage && <button className="btn-outline" style={{ borderColor: 'var(--loss)', color: 'var(--loss)' }} onClick={() => setProfileImage(null)}>ลบรูป</button>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>รองรับ JPG, PNG, WEBP ขนาดไม่เกิน 1MB</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label className="input-label">ชื่อ-นามสกุล</label><input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><label className="input-label">อีเมล</label><input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><label className="input-label">เบอร์โทรศัพท์</label><input type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div><label className="input-label">ตำแหน่ง</label><input type="text" className="input-field" defaultValue="CEO / Founder" readOnly style={{ opacity: 0.7 }} /></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                {isProfileDirty && <div style={{ color: 'var(--warning)', fontSize: '13px', fontWeight: 600 }}>⚠️ มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</div>}
                <button className={`quick-action-btn ${isProfileDirty ? 'primary' : ''}`} onClick={handleSaveProfile} disabled={!isProfileDirty} style={{ opacity: isProfileDirty ? 1 : 0.5 }}>บันทึกการเปลี่ยนแปลง</button>
              </div>
            </div>
          )}

          {/* --- TAB: SECURITY (แก้ไขให้ใช้งานได้แล้ว) --- */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>เปลี่ยนรหัสผ่าน (Change Password)</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label className="input-label">รหัสผ่านปัจจุบัน</label>
                  <input type="password" title="รหัสผ่านปัจจุบัน" className="input-field" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div>
                  <label className="input-label">รหัสผ่านใหม่</label>
                  <input type="password" title="รหัสผ่านใหม่" className="input-field" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div>
                  <label className="input-label">ยืนยันรหัสผ่านใหม่</label>
                  <input type="password" title="ยืนยันรหัสผ่านใหม่" className="input-field" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                {isSecurityDirty && <div style={{ color: 'var(--warning)', fontSize: '13px', fontWeight: 600 }}>⚠️ มีข้อมูลที่ยังไม่ได้อัปเดต</div>}
                <button 
                  className={`quick-action-btn ${isSecurityDirty ? 'primary' : ''}`} 
                  onClick={handleUpdatePassword}
                  disabled={!isSecurityDirty}
                  style={{ opacity: isSecurityDirty ? 1 : 0.5 }}
                >
                  อัปเดตรหัสผ่าน
                </button>
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
            </div>
          )}

        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div style={{ position: 'fixed', top: '90px', right: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderLeft: '4px solid var(--profit)', color: 'var(--text-main)', padding: '16px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 9999, animation: 'pageEnter 0.3s ease-out forwards' }}>
          <div style={{ width: '24px', height: '24px', background: 'var(--profit)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>✓</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>{toastMsg.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{toastMsg.desc}</div>
          </div>
        </div>
      )}

    </div>
  );
}