import React, { useState, useEffect } from 'react';

// 🌐 พจนานุกรมสำหรับหน้า Settings
const dict: Record<string, any> = {
  th: {
    pageTitle: "Settings",
    pageSubtitle: "จัดการข้อมูลส่วนตัว ตั้งค่าความปลอดภัย และระบบของร้าน",
    tabProfile: "My Profile",
    tabSecurity: "Security",
    tabNotifications: "Notifications",
    tabPrivacy: "การจัดการข้อมูลส่วนบุคคล",
    tabHelp: "ช่วยเหลือ & แนะนำการใช้งาน",
    tabContact: "ติดต่อเรา",
    tabTerms: "ข้อกำหนดและเงื่อนไข",
    
    saveBtn: "บันทึกการเปลี่ยนแปลง",
    closeBtn: "ปิดหน้าต่าง",
    
    // Profile
    profileTitle: "ข้อมูลส่วนตัว (My Profile)",
    profileName: "ชื่อ-นามสกุล",
    profileEmail: "อีเมล",
    profilePhone: "เบอร์โทรศัพท์",
    profileRole: "ตำแหน่ง/สิทธิ์การใช้งาน",
    uploadPic: "อัปโหลดรูปภาพ",
    
    // Security
    secTitle: "ความปลอดภัย (Security)",
    secChangePass: "เปลี่ยนรหัสผ่าน",
    secCurrentPass: "รหัสผ่านปัจจุบัน",
    secNewPass: "รหัสผ่านใหม่",
    secConfirmPass: "ยืนยันรหัสผ่านใหม่",
    sec2FA: "การยืนยันตัวตนแบบสองขั้นตอน (2FA)",
    sec2FADesc: "เพิ่มความปลอดภัยให้บัญชีของคุณด้วยตัวเลือกการยืนยันตัวตนเพิ่มเติม",
    sec2FAAuthApp: "แอปพลิเคชัน Authenticator",
    sec2FAAuthAppDesc: "รับรหัสผ่านชั่วคราว (OTP) ผ่าน Google หรือ Microsoft Authenticator",
    sec2FAEmail: "ยืนยันผ่านอีเมล",
    sec2FAEmailDesc: "ส่งรหัสรักษาความปลอดภัยไปที่อีเมลที่ผูกไว้กับบัญชี",
    sec2FASMS: "ยืนยันผ่าน SMS",
    sec2FASMSDesc: "รับรหัสรักษาความปลอดภัยทางข้อความ SMS เบอร์มือถือ",

    // ข้อความแจ้งเตือน (Alerts)
    alertPassChanged: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!",
    alertPassMismatch: "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน!",
    alertPassEmpty: "กรุณากรอกข้อมูลรหัสผ่านให้ครบถ้วน",
    alert2FAEnabled: "เปิดใช้งานแล้ว! (จำลองการตั้งค่าระบบเรียบร้อย)",
    alert2FADisabled: "ปิดการใช้งานเรียบร้อยแล้ว",

    notifTitle: "การแจ้งเตือน (Notifications)",
    notifDaily: "แจ้งเตือนยอดขายรายวัน",
    notifDailyDesc: "ส่งสรุปยอดขายไปที่อีเมลทุกวันเวลา 22:00 น.",
    
    privacyTitle: "การจัดการข้อมูลส่วนบุคคล (PDPA)",
    privacyExport: "ดาวน์โหลดข้อมูลส่วนตัว",
    privacyExportDesc: "ขอรับสำเนาข้อมูลส่วนบุคคลของคุณที่ระบบจัดเก็บไว้",
    privacyDelete: "ขอลบบัญชีและข้อมูล",
    privacyDeleteDesc: "ลบข้อมูลทั้งหมดของคุณออกจากระบบอย่างถาวร (ไม่สามารถกู้คืนได้)",

    helpTitle: "ช่วยเหลือและคู่มือการใช้งาน",
    helpFaq: "คำถามที่พบบ่อย (FAQ)",
    helpVideo: "วิดีโอสอนการใช้งาน",

    contactTitle: "ติดต่อทีมงานสนับสนุน",
    contactEmail: "อีเมลช่วยเหลือ: support@bizflow.com",
    contactLine: "LINE Official: @bizflow_support",

    termsTitle: "ข้อกำหนดและเงื่อนไขการใช้งาน",
    termsDesc: "อัปเดตล่าสุดเมื่อ: 1 มกราคม 2026",
    termsSummaryHeader: "สรุปข้อตกลงสำคัญ (Summary):",
    termsSum1: "1. ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัยตามมาตรฐานและกฎหมาย PDPA",
    termsSum2: "2. ห้ามผู้ใช้งานนำระบบ แพลตฟอร์ม หรือข้อมูลไปใช้ในทางที่ผิดกฎหมาย",
    termsSum3: "3. BizFlow สงวนสิทธิ์ในการปรับปรุงหรือแก้ไขระบบ โดยจะแจ้งให้ทราบล่วงหน้า",
    termsSum4: "4. หากพบการละเมิดสิทธิ์ ระบบอาจพิจารณาระงับบัญชีผู้ใช้งานชั่วคราว",
    termsReadFull: "อ่านข้อกำหนดฉบับเต็ม",
    termsFullTitle: "ข้อกำหนดและเงื่อนไขฉบับเต็ม (Full Terms & Conditions)"
  },
  en: {
    pageTitle: "Settings",
    pageSubtitle: "Manage your personal data, security settings, and system preferences.",
    tabProfile: "My Profile",
    tabSecurity: "Security",
    tabNotifications: "Notifications",
    tabPrivacy: "Personal Data (PDPA)",
    tabHelp: "Help & User Guide",
    tabContact: "Contact Us",
    tabTerms: "Terms & Conditions",
    
    saveBtn: "Save Changes",
    closeBtn: "Close",
    
    // Profile
    profileTitle: "My Profile",
    profileName: "Full Name",
    profileEmail: "Email",
    profilePhone: "Phone Number",
    profileRole: "Role/Permission",
    uploadPic: "Upload Picture",
    
    // Security
    secTitle: "Security",
    secChangePass: "Change Password",
    secCurrentPass: "Current Password",
    secNewPass: "New Password",
    secConfirmPass: "Confirm New Password",
    sec2FA: "Two-Factor Authentication (2FA)",
    sec2FADesc: "Enhance your account security with additional verification methods.",
    sec2FAAuthApp: "Authenticator App",
    sec2FAAuthAppDesc: "Get an OTP via Google or Microsoft Authenticator.",
    sec2FAEmail: "Email Verification",
    sec2FAEmailDesc: "Receive a security code at your registered email address.",
    sec2FASMS: "SMS Verification",
    sec2FASMSDesc: "Receive a security code via text message (SMS).",

    // ข้อความแจ้งเตือน (Alerts)
    alertPassChanged: "Password successfully changed!",
    alertPassMismatch: "New passwords do not match!",
    alertPassEmpty: "Please fill in all password fields.",
    alert2FAEnabled: "Enabled successfully! (Simulated setup complete)",
    alert2FADisabled: "Disabled successfully.",

    notifTitle: "Notifications",
    notifDaily: "Daily Sales Alert",
    notifDailyDesc: "Send daily sales summary to your email at 10:00 PM.",
    
    privacyTitle: "Personal Data Management (PDPA)",
    privacyExport: "Export Personal Data",
    privacyExportDesc: "Request a copy of your personal data stored in our system.",
    privacyDelete: "Delete Account & Data",
    privacyDeleteDesc: "Permanently delete all your data from the system (Irreversible).",

    helpTitle: "Help & Support",
    helpFaq: "Frequently Asked Questions (FAQ)",
    helpVideo: "Video Tutorials",

    contactTitle: "Contact Support Team",
    contactEmail: "Support Email: support@bizflow.com",
    contactLine: "LINE Official: @bizflow_support",

    termsTitle: "Terms and Conditions",
    termsDesc: "Last updated: January 1, 2026",
    termsSummaryHeader: "Key Terms Summary:",
    termsSum1: "1. Your data is securely stored in compliance with PDPA regulations.",
    termsSum2: "2. Misuse of the platform or data for illegal activities is strictly prohibited.",
    termsSum3: "3. BizFlow reserves the right to update the system and will notify you in advance.",
    termsSum4: "4. Accounts found violating these terms may be subject to temporary suspension.",
    termsReadFull: "Read Full Terms",
    termsFullTitle: "Full Terms & Conditions"
  }
};

export default function SettingsPage() {
  const [language, setLanguage] = useState(localStorage.getItem('bizflow_language') || 'th');
  const t = dict[language];

  const [activeTab, setActiveTab] = useState('security'); 
  const [showFullTerms, setShowFullTerms] = useState(false);

  // ระบบจัดการ State รหัสผ่าน
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // ระบบจัดการ State 2FA
  const [twoFactor, setTwoFactor] = useState(() => {
    const saved = localStorage.getItem('bizflow_2fa_settings');
    return saved ? JSON.parse(saved) : { app: false, email: true, sms: false }; 
  });

  useEffect(() => {
    const handleLangUpdate = () => setLanguage(localStorage.getItem('bizflow_language') || 'th');
    window.addEventListener('language_updated', handleLangUpdate);
    return () => window.removeEventListener('language_updated', handleLangUpdate);
  }, []);

  const handlePasswordChange = () => {
    if (!currentPass || !newPass || !confirmPass) {
      alert(t.alertPassEmpty);
      return;
    }
    if (newPass !== confirmPass) {
      alert(t.alertPassMismatch);
      return;
    }
    alert(t.alertPassChanged);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleToggle2FA = (method: 'app' | 'email' | 'sms') => {
    const newState = { ...twoFactor, [method]: !twoFactor[method] };
    setTwoFactor(newState);
    localStorage.setItem('bizflow_2fa_settings', JSON.stringify(newState));

    if (newState[method]) {
      alert(`[${method.toUpperCase()}] ${t.alert2FAEnabled}`);
    } else {
      alert(`[${method.toUpperCase()}] ${t.alert2FADisabled}`);
    }
  };

  const renderTabButton = (id: string, icon: string, label: string) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '12px 16px',
          background: isActive ? 'var(--bg-surface)' : 'transparent',
          border: 'none',
          borderRadius: '12px',
          color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
          fontWeight: isActive ? 700 : 500,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s ease',
          fontSize: '14px'
        }}
        onMouseOver={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-main)'; }}
        onMouseOut={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        <span style={{ fontSize: '18px' }}>{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px', paddingBottom: '40px', animation: 'pageEnter 0.5s ease-out forwards', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          ⚙️ {t.pageTitle}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>
          {t.pageSubtitle}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {renderTabButton('profile', '👤', t.tabProfile)}
          {renderTabButton('security', '🔒', t.tabSecurity)}
          {renderTabButton('notifications', '🔔', t.tabNotifications)}
          <div style={{ height: '1px', background: 'var(--border-light)', margin: '12px 0' }}></div>
          {renderTabButton('privacy', '🛡️', t.tabPrivacy)}
          {renderTabButton('help', '❓', t.tabHelp)}
          {renderTabButton('contact', '💬', t.tabContact)}
          {renderTabButton('terms', '📜', t.tabTerms)}
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>

          {activeTab === 'profile' && (
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px' }}>{t.profileTitle}</h2>
              
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--bg-body)', border: '2px dashed var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>
                <div>
                  <button style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginBottom: '8px' }}>{t.uploadPic}</button>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>JPG, GIF or PNG. Max size of 2MB.</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.profileName}</label>
                  <input type="text" className="input-field" defaultValue="Admin BizFlow" style={{ background: 'var(--bg-body)' }} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.profilePhone}</label>
                  <input type="text" className="input-field" defaultValue="081-234-5678" style={{ background: 'var(--bg-body)' }} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.profileEmail}</label>
                  <input type="email" className="input-field" defaultValue="admin@bizflow.com" style={{ background: 'var(--bg-body)' }} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.profileRole}</label>
                  <input type="text" className="input-field" defaultValue="Super Administrator" disabled style={{ background: 'var(--bg-body)', opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
              </div>
              <button style={{ padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '32px' }}>{t.saveBtn}</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px' }}>{t.secTitle}</h2>
              
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', color: 'var(--text-main)' }}>{t.secChangePass}</h3>
                <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.secCurrentPass}</label>
                    <input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} className="input-field" placeholder="••••••••" style={{ background: 'var(--bg-body)' }} />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.secNewPass}</label>
                    <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="input-field" placeholder="••••••••" style={{ background: 'var(--bg-body)' }} />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.secConfirmPass}</label>
                    <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="input-field" placeholder="••••••••" style={{ background: 'var(--bg-body)' }} />
                  </div>
                  <button onClick={handlePasswordChange} style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: 'fit-content', marginTop: '8px', transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-card)'}>
                    {t.saveBtn}
                  </button>
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--border-light)', margin: '32px 0' }}></div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-main)' }}>{t.sec2FA}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 20px' }}>{t.sec2FADesc}</p>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: twoFactor.app ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-body)', borderRadius: '16px', border: twoFactor.app ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>🔐</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)' }}>{t.sec2FAAuthApp}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{t.sec2FAAuthAppDesc}</div>
                      </div>
                    </div>
                    <input type="checkbox" checked={twoFactor.app} onChange={() => handleToggle2FA('app')} style={{ width: '22px', height: '22px', accentColor: '#3b82f6', cursor: 'pointer' }} />
                  </label>

                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: twoFactor.email ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-body)', borderRadius: '16px', border: twoFactor.email ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>✉️</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)' }}>{t.sec2FAEmail}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{t.sec2FAEmailDesc}</div>
                      </div>
                    </div>
                    <input type="checkbox" checked={twoFactor.email} onChange={() => handleToggle2FA('email')} style={{ width: '22px', height: '22px', accentColor: '#22c55e', cursor: 'pointer' }} />
                  </label>

                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: twoFactor.sms ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-body)', borderRadius: '16px', border: twoFactor.sms ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>📱</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)' }}>{t.sec2FASMS}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{t.sec2FASMSDesc}</div>
                      </div>
                    </div>
                    <input type="checkbox" checked={twoFactor.sms} onChange={() => handleToggle2FA('sms')} style={{ width: '22px', height: '22px', accentColor: '#f59e0b', cursor: 'pointer' }} />
                  </label>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px' }}>{t.notifTitle}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'var(--bg-body)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{t.notifDaily}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.notifDailyDesc}</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px' }}>{t.privacyTitle}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'var(--bg-body)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{t.privacyExport}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.privacyExportDesc}</div>
                </div>
                <button style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>📥 Export</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--loss)', marginBottom: '4px' }}>{t.privacyDelete}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.privacyDeleteDesc}</div>
                </div>
                <button style={{ padding: '8px 16px', background: 'var(--loss)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px' }}>{t.helpTitle}</h2>
              <div style={{ display: 'grid', gap: '12px' }}>
                <button style={{ width: '100%', padding: '16px 20px', textAlign: 'left', background: 'var(--bg-body)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📖 {t.helpFaq}</span> <span>→</span>
                </button>
                <button style={{ width: '100%', padding: '16px 20px', textAlign: 'left', background: 'var(--bg-body)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                  <span>▶️ {t.helpVideo}</span> <span>→</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px' }}>{t.contactTitle}</h2>
              <div style={{ padding: '24px', background: 'var(--bg-body)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--text-main)' }}>
                  <span style={{ fontSize: '20px' }}>✉️</span> {t.contactEmail}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: 'var(--text-main)' }}>
                  <span style={{ fontSize: '20px' }}>💬</span> {t.contactLine}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>{t.termsTitle}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 24px' }}>{t.termsDesc}</p>
              
              <div style={{ padding: '24px', background: 'var(--bg-body)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.8', marginBottom: '24px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px', fontSize: '15px' }}>{t.termsSummaryHeader}</div>
                <p style={{ margin: '0 0 8px 0' }}>{t.termsSum1}</p>
                <p style={{ margin: '0 0 8px 0' }}>{t.termsSum2}</p>
                <p style={{ margin: '0 0 8px 0' }}>{t.termsSum3}</p>
                <p style={{ margin: '0 0 0 0' }}>{t.termsSum4}</p>
              </div>

              <button 
                onClick={() => setShowFullTerms(true)}
                style={{ padding: '12px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s', fontSize: '14px', letterSpacing: '-0.01em' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-body)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
              >
                📄 {t.termsReadFull}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 🚀 แก้ปัญหาบัก OXC ตรงนี้: ใส่ {" "} ครอบข้อความยาวๆ เพื่อกันตัวอ่านโค้ดพัง */}
      {showFullTerms && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px 20px', overflowY: 'auto', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--bg-surface)', width: '100%', maxWidth: '800px', maxHeight: 'calc(100vh - 80px)', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 24px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>{t.termsFullTitle}</h2>
              <button onClick={() => setShowFullTerms(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.8' }}>
              {language === 'th' ? (
                <>
                  <h3 style={{ color: 'var(--text-main)', marginTop: 0, fontSize: '16px' }}>{"1. บทนำและขอบเขตการใช้งาน"}</h3>
                  <p>{"ยินดีต้อนรับเข้าสู่ BizFlow แพลตฟอร์มบริหารจัดการธุรกิจแบบครบวงจร การที่คุณเข้าใช้งานระบบนี้ ถือว่าคุณได้อ่าน เข้าใจ และยอมรับข้อตกลงและเงื่อนไขทั้งหมดที่ระบุไว้ ณ ที่นี้ หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ กรุณายุติการใช้งานระบบทันที"}</p>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '16px' }}>{"2. การคุ้มครองข้อมูลส่วนบุคคล (PDPA)"}</h3>
                  <p>{"BizFlow ให้ความสำคัญสูงสุดกับความเป็นส่วนตัวของคุณ ข้อมูลส่วนบุคคลทั้งหมด (เช่น ชื่อ เบอร์โทรศัพท์ อีเมล) จะถูกจัดเก็บและประมวลผลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) เราจะไม่มีการขายหรือเผยแพร่ข้อมูลของคุณแก่บุคคลที่สามโดยไม่ได้รับอนุญาต เว้นแต่เป็นไปตามคำสั่งทางกฎหมาย"}</p>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '16px' }}>{"3. สิทธิและหน้าที่ของผู้ใช้งาน"}</h3>
                  <p>{"ผู้ใช้งานตกลงที่จะใช้แพลตฟอร์มนี้ด้วยความสุจริต ห้ามมิให้มีการดัดแปลง ทำซ้ำ แฮ็กระบบ หรือนำข้อมูลในแพลตฟอร์มไปใช้ในกิจกรรมที่ผิดกฎหมาย ทุจริต หรือละเมิดสิทธิของผู้อื่น หากตรวจพบ ทางเราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีของคุณทันทีโดยไม่ต้องแจ้งให้ทราบล่วงหน้า"}</p>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '16px' }}>{"4. การชำระเงินและการคืนเงิน (ถ้ามี)"}</h3>
                  <p>{"ในกรณีที่มีการสมัครใช้บริการแพ็กเกจพรีเมียม ผู้ใช้งานต้องชำระค่าบริการตามรอบบิลที่กำหนด บริษัทขอสงวนสิทธิ์ในการไม่คืนเงินสำหรับรอบบิลที่ได้ถูกใช้งานไปแล้ว เว้นแต่จะเกิดจากข้อผิดพลาดของระบบเราเอง"}</p>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '16px' }}>{"5. การเปลี่ยนแปลงข้อตกลง"}</h3>
                  <p>{"BizFlow ขอสงวนสิทธิ์ในการปรับปรุงหรือแก้ไขข้อกำหนดและเงื่อนไขนี้ได้ตลอดเวลา โดยการเปลี่ยนแปลงจะมีผลบังคับใช้ทันทีเมื่อมีการประกาศบนแพลตฟอร์ม เราแนะนำให้คุณตรวจสอบหน้านี้เป็นระยะ"}</p>
                </>
              ) : (
                <>
                  <h3 style={{ color: 'var(--text-main)', marginTop: 0, fontSize: '16px' }}>{"1. Introduction and Scope"}</h3>
                  <p>{"Welcome to BizFlow, the all-in-one business management platform. By accessing and using this system, you acknowledge that you have read, understood, and agreed to all the terms and conditions outlined here. If you do not agree, please discontinue using the system immediately."}</p>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '16px' }}>{"2. Personal Data Protection (PDPA)"}</h3>
                  <p>{"BizFlow prioritizes your privacy. All personal data (e.g., name, phone number, email) is stored and processed strictly in accordance with the Personal Data Protection Act (PDPA). We will never sell or disclose your data to unauthorized third parties unless required by law."}</p>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '16px' }}>{"3. User Rights and Responsibilities"}</h3>
                  <p>{"Users agree to use this platform in good faith. Modifying, copying, hacking, or using the platform's data for illegal, fraudulent, or infringing activities is strictly prohibited. If detected, we reserve the right to suspend or terminate your account immediately without prior notice."}</p>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '16px' }}>{"4. Payments and Refunds (if applicable)"}</h3>
                  <p>{"For premium package subscriptions, users must pay the service fees according to the billing cycle. The company reserves the right not to issue refunds for billing cycles that have already been utilized, except in cases of system errors on our end."}</p>
                  <h3 style={{ color: 'var(--text-main)', fontSize: '16px' }}>{"5. Amendments to Terms"}</h3>
                  <p>{"BizFlow reserves the right to update or modify these terms and conditions at any time. Changes will take effect immediately upon posting on the platform. We recommend reviewing this page periodically."}</p>
                </>
              )}
            </div>
            <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-light)', textAlign: 'right', background: 'var(--bg-body)' }}>
              <button onClick={() => setShowFullTerms(false)} style={{ padding: '12px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', fontSize: '15px' }}>{t.closeBtn}</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}