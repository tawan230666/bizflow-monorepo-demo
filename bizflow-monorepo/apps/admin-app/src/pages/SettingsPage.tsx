import React, { useState, useRef, useEffect } from 'react';

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

  // --- Security State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- Linked Accounts State ---
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: true,
    line: false,
    apple: false
  });

  // --- Settings State ---
  const [language, setLanguage] = useState('th');
  const [notifications, setNotifications] = useState({
    dailyReport: true,
    stockAlert: true,
    loginAlert: false,
    marketing: true
  });

  // --- AI Chat Support State ---
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'สวัสดีครับ 🤖 ผมคือ BizFlow AI ผู้ช่วยส่วนตัวของคุณ มีปัญหาการใช้งาน หรืออยากสอบถามอะไร พิมพ์บอกผมได้เลยครับ!' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const isProfileDirty = name !== initialName || email !== initialEmail || phone !== initialPhone || profileImage !== initialImage;
  const isSecurityDirty = currentPassword !== '' || newPassword !== '' || confirmPassword !== '';

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({ title: '', desc: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 🚀 แก้ไขฟังก์ชันอัปเดตรหัสผ่าน ให้บันทึกลง LocalStorage จริงๆ
  const handleUpdatePassword = () => {
    if (!isSecurityDirty) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('⚠️ รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    
    // บันทึกรหัสผ่านใหม่ลงระบบความจำของบราวเซอร์
    localStorage.setItem('bizflow_profile_password', newPassword);

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerToast('เปลี่ยนรหัสผ่านสำเร็จ', 'ระบบได้ทำการอัปเดตรหัสผ่านใหม่ของคุณแล้ว (สามารถใช้ล็อกอินครั้งหน้าได้เลย)');
  };

  const handleToggleConnection = (provider: 'google' | 'line' | 'apple') => {
    setConnectedAccounts(prev => {
      const newState = !prev[provider];
      const providerName = provider === 'google' ? 'Google' : provider === 'line' ? 'LINE' : 'Apple ID';
      if (newState) {
        triggerToast('เชื่อมต่อบัญชีสำเร็จ', `ระบบได้เชื่อมโยงกับบัญชี ${providerName} ของคุณแล้ว`);
      } else {
        triggerToast('ยกเลิกการเชื่อมต่อแล้ว', `ยกเลิกการผูกบัญชี ${providerName} เรียบร้อย`);
      }
      return { ...prev, [provider]: newState };
    });
  };

  const handleSendChat = (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'ขณะนี้ระบบ AI Assistant กำลังอยู่ในช่วงทดสอบ (Beta) 🛠️ หากเป็นเรื่องด่วน กรุณาคลิกที่การ์ด LINE ด้านบนเพื่อติดต่อแอดมินโดยตรงได้เลยครับ 🙏' 
      }]);
    }, 1000);
  };

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', animation: 'pageEnter 0.5s ease-out forwards', position: 'relative' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>⚙️</span> Settings
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>จัดการข้อมูลส่วนตัว ตั้งค่าความปลอดภัย และศูนย์ช่วยเหลือ</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '12px' }}>บัญชีของคุณ</div>
          <button onClick={() => setActiveTab('profile')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'profile' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'profile' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👤</span> My Profile
          </button>
          <button onClick={() => setActiveTab('security')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'security' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'security' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔒</span> Security
          </button>
          
          <div style={{ height: '1px', background: 'var(--border-light)', margin: '12px 0' }}></div>
          
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '12px' }}>ระบบแอปพลิเคชัน</div>
          <button onClick={() => setActiveTab('notifications')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'notifications' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'notifications' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔔</span> Notifications
          </button>
          <button onClick={() => setActiveTab('language')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'language' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'language' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🌐</span> Language
          </button>

          <div style={{ height: '1px', background: 'var(--border-light)', margin: '12px 0' }}></div>

          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '12px' }}>อื่นๆ</div>
          <button onClick={() => setActiveTab('support')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'support' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: activeTab === 'support' ? '#3b82f6' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🎧</span> Help & Support
          </button>
          <button onClick={() => setActiveTab('terms')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'terms' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'terms' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📜</span> Terms of Service
          </button>
          <button onClick={() => setActiveTab('about')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeTab === 'about' ? 'var(--accent-bg)' : 'transparent', color: activeTab === 'about' ? 'var(--accent)' : 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>ℹ️</span> About BizFlow
          </button>
        </div>

        {/* Content Card */}
        <div className="card" style={{ padding: '32px', minHeight: '600px' }}>
          
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

              <div style={{ marginTop: '16px', paddingTop: '32px', borderTop: '1px solid var(--border-light)' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: 'var(--text-main)' }}>การเชื่อมต่อบัญชี (Connected Accounts)</h3>
                <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--text-muted)' }}>เชื่อมต่อบัญชีโซเชียลของคุณเพื่อใช้ในการเข้าสู่ระบบ (Single Sign-On)</p>

                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-body)', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <span style={{ background: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900 }}>G</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>Google</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{connectedAccounts.google ? email : 'ยังไม่ได้เชื่อมต่อ'}</div>
                      </div>
                    </div>
                    <button onClick={() => handleToggleConnection('google')} className="filter-btn" style={{ borderColor: connectedAccounts.google ? 'var(--loss)' : 'var(--border-light)', color: connectedAccounts.google ? 'var(--loss)' : 'var(--text-main)', minWidth: '130px' }}>
                      {connectedAccounts.google ? 'ยกเลิกการเชื่อมต่อ' : 'เชื่อมต่อ'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-body)', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#06C755', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 800, boxShadow: '0 2px 8px rgba(6, 199, 85, 0.2)' }}>💬</div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>LINE</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{connectedAccounts.line ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}</div>
                      </div>
                    </div>
                    <button onClick={() => handleToggleConnection('line')} className="filter-btn" style={{ borderColor: connectedAccounts.line ? 'var(--loss)' : 'var(--border-light)', color: connectedAccounts.line ? 'var(--loss)' : 'var(--text-main)', minWidth: '130px' }}>
                      {connectedAccounts.line ? 'ยกเลิกการเชื่อมต่อ' : 'เชื่อมต่อ'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-body)', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}></div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>Apple ID</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{connectedAccounts.apple ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}</div>
                      </div>
                    </div>
                    <button onClick={() => handleToggleConnection('apple')} className="filter-btn" style={{ borderColor: connectedAccounts.apple ? 'var(--loss)' : 'var(--border-light)', color: connectedAccounts.apple ? 'var(--loss)' : 'var(--text-main)', minWidth: '130px' }}>
                      {connectedAccounts.apple ? 'ยกเลิกการเชื่อมต่อ' : 'เชื่อมต่อ'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                {isProfileDirty && <div style={{ color: 'var(--warning)', fontSize: '13px', fontWeight: 600 }}>⚠️ มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</div>}
                <button className={`quick-action-btn ${isProfileDirty ? 'primary' : ''}`} onClick={handleSaveProfile} disabled={!isProfileDirty} style={{ opacity: isProfileDirty ? 1 : 0.5 }}>บันทึกการเปลี่ยนแปลง</button>
              </div>
            </div>
          )}

          {/* --- TAB: SECURITY --- */}
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

          {/* --- TAB: NOTIFICATIONS --- */}
          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>ตั้งค่าการแจ้งเตือน (Notification Settings)</h3>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>เลือกช่องทางและประเภทข่าวสารที่คุณต้องการรับ</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>📊 แจ้งเตือนสรุปยอดขายรายวัน (Daily Report)</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ส่งรายงานยอดขายผ่านอีเมลและ LINE ทุกวันเวลา 22:00 น.</div>
                  </div>
                  <input type="checkbox" checked={notifications.dailyReport} onChange={(e) => setNotifications({...notifications, dailyReport: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>⚠️ เตือนสต็อกสินค้าเหลือน้อย (Stock Alert)</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ส่งแจ้งเตือนทันทีเมื่อมีวัตถุดิบใกล้หมดสต็อกผ่าน LINE</div>
                  </div>
                  <input type="checkbox" checked={notifications.stockAlert} onChange={(e) => setNotifications({...notifications, stockAlert: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>🔒 แจ้งเตือนการล็อกอินเครื่องใหม่ (Login Alert)</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>แจ้งเตือนผ่านอีเมลเมื่อมีการเข้าสู่ระบบจากอุปกรณ์ที่ไม่รู้จัก</div>
                  </div>
                  <input type="checkbox" checked={notifications.loginAlert} onChange={(e) => setNotifications({...notifications, loginAlert: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>📢 ข่าวสารและโปรโมชัน (Marketing)</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>รับข่าวสารอัปเดตฟีเจอร์ใหม่ๆ จากทีมงาน BizFlow</div>
                  </div>
                  <input type="checkbox" checked={notifications.marketing} onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: LANGUAGE --- */}
          {activeTab === 'language' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <div >
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>ตั้งค่าภาษา (Language & Region)</h3>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>เปลี่ยนภาษาที่แสดงผลบนระบบแดชบอร์ด</p>
              </div>

              <div style={{ display: 'grid', gap: '16px', maxWidth: '500px' }}>
                <div 
                  onClick={() => { setLanguage('th'); triggerToast('เปลี่ยนภาษาสำเร็จ', 'ระบบได้เปลี่ยนภาษาเป็น "ไทย" เรียบร้อยแล้ว'); }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: language === 'th' ? 'var(--accent-bg)' : 'var(--bg-body)', border: `1px solid ${language === 'th' ? 'var(--accent)' : 'var(--border-light)'}`, borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🇹🇭</span>
                    <span style={{ fontWeight: 600, color: language === 'th' ? 'var(--accent)' : 'var(--text-main)' }}>ภาษาไทย (Thai)</span>
                  </div>
                  {language === 'th' && <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</div>}
                </div>

                <div 
                  onClick={() => { setLanguage('en'); triggerToast('Language Changed', 'The system language has been changed to "English".'); }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: language === 'en' ? 'var(--accent-bg)' : 'var(--bg-body)', border: `1px solid ${language === 'en' ? 'var(--accent)' : 'var(--border-light)'}`, borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🇺🇸</span>
                    <span style={{ fontWeight: 600, color: language === 'en' ? 'var(--accent)' : 'var(--text-main)' }}>English (US)</span>
                  </div>
                  {language === 'en' && <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</div>}
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: HELP & SUPPORT --- */}
          {activeTab === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>ศูนย์ช่วยเหลือ (Help & Support)</h3>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>ติดต่อทีมงาน หรือสอบถามข้อมูลเบื้องต้นกับผู้ช่วย AI ของเรา</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <a href="mailto:support@bizflow.com?subject=รายงานปัญหาการใช้งาน BizFlow Dashboard" style={{ textDecoration: 'none', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>✉️</div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Email Support</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>support@bizflow.com</div>
                  </div>
                </a>
                
                <a href="https://line.me/R/ti/p/@bizflow_support" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 199, 85, 0.1)', color: '#06C755', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💬</div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>LINE Official</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>@bizflow_support</div>
                  </div>
                </a>
              </div>

              <div style={{ border: '1px solid var(--border-light)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '400px', background: 'var(--bg-body)' }}>
                <div style={{ padding: '16px 20px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>BizFlow AI Assistant</div>
                    <div style={{ fontSize: '12px', color: 'var(--profit)', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--profit)' }}></div> Online</div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {chatMessages.map((msg, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: '16px', borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px', borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px', background: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-surface)', color: msg.sender === 'user' ? '#fff' : 'var(--text-main)', border: msg.sender === 'ai' ? '1px solid var(--border-light)' : 'none', fontSize: '14px', lineHeight: 1.5 }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div style={{ padding: '0 20px 12px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                  {['วิธีเพิ่มพนักงาน?', 'ดูยอดขายรายเดือนยังไง?', 'ลบเมนูอาหารทำไง?'].map((q, idx) => (
                    <button key={idx} onClick={() => handleSendChat(undefined, q)} style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>{q}</button>
                  ))}
                </div>

                <form onSubmit={handleSendChat} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '12px', background: 'var(--bg-surface)' }}>
                  <input type="text" placeholder="พิมพ์คำถามของคุณที่นี่..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-light)', background: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '14px' }} />
                  <button type="submit" style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}><span style={{ transform: 'rotate(-45deg)', marginLeft: '4px', marginBottom: '4px' }}>🚀</span></button>
                </form>
              </div>
            </div>
          )}

          {/* --- TAB: TERMS OF SERVICE --- */}
          {activeTab === 'terms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pageEnter 0.3s ease-out' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>กฎระเบียบการใช้งาน (Terms of Service)</h3>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>ข้อตกลงและเงื่อนไขในการใช้บริการระบบ BizFlow</p>
              </div>

              <div style={{ padding: '24px', background: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-light)', height: '400px', overflowY: 'auto', fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
                <h4 style={{ color: 'var(--text-main)', fontSize: '16px', marginBottom: '12px' }}>1. การยอมรับเงื่อนไข</h4>
                <p style={{ marginBottom: '20px' }}>การเข้าถึงและใช้งานระบบ BizFlow ("บริการ") แสดงว่าท่านตกลงที่จะผูกพันตามข้อกำหนดและเงื่อนไขเหล่านี้ หากท่านไม่เห็นด้วยกับข้อกำหนดใดๆ โปรดงดเว้นการใช้บริการ</p>
                
                <h4 style={{ color: 'var(--text-main)', fontSize: '16px', marginBottom: '12px' }}>2. สิทธิ์และความรับผิดชอบของผู้ใช้</h4>
                <p style={{ marginBottom: '20px' }}>- ท่านต้องเก็บรักษาข้อมูลการเข้าสู่ระบบ (รหัสผ่าน) ไว้เป็นความลับ<br/>- ท่านตกลงที่จะไม่ใช้บริการนี้ในทางที่ผิดกฎหมาย หรือสร้างความเสียหายต่อระบบ<br/>- ข้อมูลทั้งหมดที่ท่านป้อนเข้าสู่ระบบ ถือเป็นทรัพย์สินและความรับผิดชอบของท่าน</p>
                
                <h4 style={{ color: 'var(--text-main)', fontSize: '16px', marginBottom: '12px' }}>3. ความเป็นส่วนตัวและข้อมูล</h4>
                <p style={{ marginBottom: '20px' }}>เราให้ความสำคัญกับความเป็นส่วนตัวของข้อมูลลูกค้าและยอดขายของท่าน ข้อมูลทั้งหมดจะถูกเข้ารหัสและรักษาความปลอดภัยอย่างสูงสุด และจะไม่มีการเปิดเผยต่อบุคคลที่สามโดยไม่ได้รับอนุญาต ยกเว้นกรณีที่มีคำสั่งศาล</p>
                
                <h4 style={{ color: 'var(--text-main)', fontSize: '16px', marginBottom: '12px' }}>4. การระงับการให้บริการ</h4>
                <p>BizFlow ขอสงวนสิทธิ์ในการระงับ หรือยกเลิกบัญชีผู้ใช้งานทันที หากพบว่ามีการละเมิดข้อกำหนดการใช้งาน หรือมีการกระทำที่อาจก่อให้เกิดความเสียหายต่อแพลตฟอร์มและผู้ใช้งานท่านอื่น</p>
                
                <p style={{ marginTop: '40px', fontSize: '12px', textAlign: 'center', opacity: 0.7 }}>อัปเดตล่าสุดเมื่อ: 1 มกราคม 2026</p>
              </div>
            </div>
          )}

          {/* --- TAB: ABOUT BIZFLOW --- */}
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', animation: 'pageEnter 0.3s ease-out', textAlign: 'center', minHeight: '400px' }}>
              
              <div style={{ width: '120px', height: '120px', borderRadius: '24px', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}>
                <span style={{ fontSize: '48px', fontWeight: 900, color: '#fff', letterSpacing: '-2px' }}>BF</span>
              </div>
              
              <div>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px', color: 'var(--text-main)', letterSpacing: '-1px' }}>BizFlow</h2>
                <div style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600, padding: '4px 12px', background: 'var(--accent-bg)', borderRadius: '20px', display: 'inline-block' }}>Version 2.0.4 (Build 2026)</div>
              </div>

              <p style={{ maxWidth: '500px', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, margin: '16px 0' }}>
                BizFlow คือแพลตฟอร์มบริหารจัดการร้านอาหารและแฟรนไชส์แบบครบวงจร ที่ออกแบบมาเพื่อผู้บริหารยุคใหม่ที่ต้องการข้อมูลที่แม่นยำและรวดเร็ว เพื่อการตัดสินใจที่ดีที่สุด
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Website</a>
                <span style={{ color: 'var(--border-light)' }}>•</span>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Facebook</a>
                <span style={{ color: 'var(--border-light)' }}>•</span>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Twitter / X</a>
              </div>

              <div style={{ marginTop: '32px', fontSize: '12px', color: 'var(--text-muted)', opacity: 0.6 }}>
                &copy; 2026 BizFlow Technologies Co., Ltd. All rights reserved.
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