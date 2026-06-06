import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const dict: Record<string, any> = {
  th: {
    welcome: "ยินดีต้อนรับกลับมา",
    enterDetails: "กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ",
    createAcc: "สร้างบัญชีใหม่",
    enterPersonal: "กรุณากรอกข้อมูลส่วนตัวเพื่อเริ่มต้นใช้งาน",
    fullName: "ชื่อ-นามสกุล",
    phone: "เบอร์โทรศัพท์",
    email: "อีเมล",
    password: "รหัสผ่าน",
    remember: "จดจำฉันไว้",
    forgot: "ลืมรหัสผ่าน?",
    signIn: "เข้าสู่ระบบ",
    signUp: "สมัครสมาชิก",
    orContinue: "หรือดำเนินการต่อด้วย",
    alreadyHave: "มีบัญชีอยู่แล้ว? ",
    dontHave: "ยังไม่มีบัญชีใช่ไหม? ",
    manageTitle: "จัดการทุกอย่างในที่เดียว",
    manageDesc: "ยกระดับการบริหารธุรกิจของคุณด้วยแพลตฟอร์มที่ครบจบในตัวเดียว",
    
    // 🔒 ข้อความสำหรับ Modal PDPA แบบใหม่
    termsConsentTitle: "ข้อตกลงและความยินยอม",
    termsConsentSub: "การเก็บ รวบรวม และใช้ข้อมูลส่วนบุคคล",
    iAccept: "ฉันยอมรับ ข้อกำหนดและเงื่อนไขการให้บริการ",
    acceptBtn: "ยอมรับและสมัครสมาชิก",
    cancelBtn: "ยกเลิก",
  },
  en: {
    welcome: "Welcome back",
    enterDetails: "Please enter your details to sign in.",
    createAcc: "Create an account",
    enterPersonal: "Enter your personal details to get started.",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email address",
    password: "Password",
    remember: "Remember me",
    forgot: "Forgot password?",
    signIn: "Sign in",
    signUp: "Sign up",
    orContinue: "OR CONTINUE WITH",
    alreadyHave: "Already have an account? ",
    dontHave: "Don't have an account? ",
    manageTitle: "Manage everything in one place",
    manageDesc: "Streamline your business operations with our all-in-one platform.",
    
    // 🔒 ข้อความสำหรับ Modal PDPA แบบใหม่
    termsConsentTitle: "Terms & Consent",
    termsConsentSub: "Data Collection and Usage Policy",
    iAccept: "I accept the Terms and Conditions of Service",
    acceptBtn: "Accept & Register",
    cancelBtn: "Cancel",
  }
};

function GoogleLoginButton() {
  const navigate = useNavigate();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/0.3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();
        localStorage.setItem('bizflow_session', googleUser.email);
        localStorage.setItem('bizflow_profile_name', googleUser.name);
        localStorage.setItem('bizflow_profile_image', googleUser.picture);
        navigate('/overview');
      } catch (error) {
        console.error('ดึงข้อมูลโปรไฟล์จาก Google ล้มเหลว:', error);
      }
    },
    onError: () => alert('การเข้าสู่ระบบด้วย Google ล้มเหลว หรือถูกยกเลิก'),
  });

  return (
    <button 
      type="button" 
      onClick={() => loginWithGoogle()}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)', cursor: 'pointer', transition: '0.2s', width: '100%' }} 
      onMouseOver={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.08)'} 
      onMouseOut={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.03)'}
    >
      <span style={{ background: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: '18px' }}>G</span>
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('bizflow_language') || 'th');
  const t = dict[language];

  // 🔑 ใส่ Client ID ของคุณ
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

  useEffect(() => {
    const handleLangUpdate = () => setLanguage(localStorage.getItem('bizflow_language') || 'th');
    window.addEventListener('language_updated', handleLangUpdate);
    return () => window.removeEventListener('language_updated', handleLangUpdate);
  }, []);

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // 🚀 State สำหรับเปิด/ปิด หน้าต่างเงื่อนไข
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 🟢 สเตปที่ 1: พอกดปุ่ม Sign up ในฟอร์ม ให้เช็กว่าฟอร์มครบไหม ถ้าครบให้เปิดหน้าต่าง Modal
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      setShowTermsModal(true); // เปิดหน้าต่างอ่านกฎ
    } else {
      // ถ้าเป็นโหมด Login ปกติ ก็เข้าสู่ระบบไปเลย
      processLogin();
    }
  };

  // 🟢 สเตปที่ 2: กดปุ่ม "ยอมรับ" ใน Modal เพื่อยืนยันการสมัคร
  const processRegistration = () => {
    const existingUsers = JSON.parse(localStorage.getItem('bizflow_users') || '[]');
    if (existingUsers.some((user: any) => user.email === email)) {
      alert(language === 'th' ? 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น' : 'Email already in use.');
      setShowTermsModal(false);
      return;
    }
    const newUser = { id: `USR-${Date.now()}`, fullName, phone, email, password, role: 'Admin', createdAt: new Date().toISOString() };
    existingUsers.push(newUser);
    localStorage.setItem('bizflow_users', JSON.stringify(existingUsers));
    
    alert(language === 'th' ? 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ' : 'Registration successful! Please log in.');
    setShowTermsModal(false);
    setIsRegistering(false); 
    setPassword('');
    setAgreeTerms(false);
  };

  const processLogin = () => {
    const currentAdminEmail = localStorage.getItem('bizflow_profile_email') || 'admin@bizflow.com';
    const currentAdminPassword = localStorage.getItem('bizflow_profile_password') || '12345678';
    const existingUsers = JSON.parse(localStorage.getItem('bizflow_users') || '[]');
    const foundUser = existingUsers.find((user: any) => user.email === email && user.password === password);

    if (foundUser || (email === currentAdminEmail && password === currentAdminPassword)) {
      localStorage.setItem('bizflow_session', email);
      setTimeout(() => navigate('/overview'), 500);
    } else {
      alert(language === 'th' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง!' : 'Invalid email or password!');
    }
  };

  const handleSocialLogin = (provider: string) => {
    localStorage.setItem('bizflow_session', `${provider.toLowerCase()}_user@bizflow.com`);
    localStorage.setItem('bizflow_profile_name', `${provider} User`);
    setTimeout(() => navigate('/overview'), 500);
  };

  const toggleLanguage = () => {
    const newLang = language === 'th' ? 'en' : 'th';
    setLanguage(newLang);
    localStorage.setItem('bizflow_language', newLang);
    window.dispatchEvent(new Event('language_updated'));
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-wrapper">
        <div className="login-left">
          <div style={{ width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div className="login-logo" style={{ margin: 0 }}>BizFlow</div>
            <button type="button" onClick={toggleLanguage} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
              {language === 'th' ? '🇹🇭 TH' : '🇺🇸 EN'}
            </button>
          </div>
          
          <div className="login-form-container">
            <h1 className="login-title">{isRegistering ? t.createAcc : t.welcome}</h1>
            <p className="login-subtitle">{isRegistering ? t.enterPersonal : t.enterDetails}</p>

            <form onSubmit={handleInitialSubmit}>
              {isRegistering && (
                <>
                  <div className="input-group">
                    <label className="input-label">{t.fullName}</label>
                    <input type="text" className="input-field" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t.phone}</label>
                    <input type="tel" className="input-field" placeholder="08X-XXX-XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </>
              )}
              <div className="input-group">
                <label className="input-label">{t.email}</label>
                <input type="email" className="input-field" placeholder="admin@bizflow.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">{t.password}</label>
                <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {!isRegistering && (
                <div className="login-options">
                  <label className="checkbox-label"><input type="checkbox" /> {t.remember}</label>
                  <a href="#" className="forgot-link">{t.forgot}</a>
                </div>
              )}

              {/* 🚀 พอกดปุ่มนี้ในโหมด Sign Up มันจะไปเรียก Modal ให้เปิดขึ้นมา */}
              <button type="submit" className="btn-login" style={{ marginTop: isRegistering ? '24px' : '0' }}>
                {isRegistering ? t.signUp : t.signIn}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>{t.orContinue}</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <GoogleLoginButton />
              <button type="button" onClick={() => handleSocialLogin('LINE')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', borderRadius: '14px', border: '1px solid rgba(6, 199, 85, 0.2)', background: 'rgba(6, 199, 85, 0.08)', color: '#06C755', cursor: 'pointer', transition: '0.2s', fontSize: '18px' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(6, 199, 85, 0.15)'} onMouseOut={(e) => e.currentTarget.style.background='rgba(6, 199, 85, 0.08)'}>💬</button>
              <button type="button" onClick={() => handleSocialLogin('Apple')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', cursor: 'pointer', transition: '0.2s', fontSize: '20px' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.15)'} onMouseOut={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.05)'}></button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
              {isRegistering ? t.alreadyHave : t.dontHave}
              <button type="button" onClick={() => { setIsRegistering(!isRegistering); setPassword(''); setAgreeTerms(false); setShowTermsModal(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                {isRegistering ? t.signIn : t.signUp}
              </button>
            </p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-pattern"></div>
          <div className="card" style={{ width: '80%', height: '60%', background: 'var(--bg-surface)', borderRadius: '24px', boxShadow: '0 24px 50px -12px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ width: '40%', height: '24px', background: 'var(--bg-body)', borderRadius: '6px' }}></div>
              <div style={{ width: '20%', height: '24px', background: 'var(--bg-body)', borderRadius: '6px' }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div style={{ height: '100px', background: 'var(--bg-body)', borderRadius: '12px' }}></div>
              <div style={{ height: '100px', background: 'var(--bg-body)', borderRadius: '12px' }}></div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-body)', borderRadius: '12px' }}></div>
          </div>

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 12px' }}>{t.manageTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{t.manageDesc}</p>
          </div>
        </div>
      </div>

      {/* 🚀 MODAL: หน้าต่างอ่านข้อกำหนดและกดยอมรับแบบเดียวกับแอป BKK Waste Pay */}
      {showTermsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: 'var(--bg-surface)', width: '100%', maxWidth: '500px', maxHeight: '85vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 32px 64px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s ease-out' }}>
            
            {/* หัว Modal */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', textAlign: 'center', background: 'var(--bg-card)' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>{t.termsConsentTitle}</h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{t.termsConsentSub}</p>
            </div>

            {/* เนื้อหาข้อตกลง (เลื่อนอ่านได้) */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', background: 'var(--bg-body)' }}>
              {language === 'th' ? (
                <>
                  <p>แอปพลิเคชัน BizFlow คือแพลตฟอร์มสำหรับบริหารจัดการธุรกิจ ผู้ใช้งานสามารถลงชื่อเข้าใช้งานระบบ โดย "ผู้ให้บริการ" จะต้องทำการเก็บรวบรวมข้อมูลส่วนบุคคลของท่าน ได้แก่ ชื่อ-นามสกุล, เบอร์โทรศัพท์, และอีเมล เพื่อวัตถุประสงค์ในการระบุตัวตนและรักษาความปลอดภัยของบัญชีผู้ใช้งาน</p>
                  <p><strong>1. การรักษาความลับ</strong><br/>ข้อมูลของท่านจะถูกเก็บรักษาไว้เป็นความลับขั้นสูงสุดตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</p>
                  <p><strong>2. การใช้งานข้อมูล</strong><br/>เราจะใช้ข้อมูลของท่านเพื่อการให้บริการ แจ้งเตือนสถานะ และปรับปรุงประสบการณ์การใช้งานเท่านั้น จะไม่มีการนำไปขายหรือส่งต่อให้บุคคลที่สามโดยเด็ดขาด</p>
                  <p><strong>3. การขอลบข้อมูล</strong><br/>ท่านสามารถขอลบบัญชีและข้อมูลส่วนตัวออกจากระบบได้ตลอดเวลาผ่านเมนู "การตั้งค่า (Settings)" ภายในแอปพลิเคชัน</p>
                </>
              ) : (
                <>
                  <p>BizFlow is a business management platform. To use the system, the "Service Provider" must collect your personal data, including your Full Name, Phone Number, and Email Address, for the purposes of identity verification and account security.</p>
                  <p><strong>1. Confidentiality</strong><br/>Your data will be kept strictly confidential in compliance with the Personal Data Protection Act (PDPA).</p>
                  <p><strong>2. Data Usage</strong><br/>We will only use your data to provide services, send status alerts, and improve your user experience. Your data will never be sold or shared with third parties.</p>
                  <p><strong>3. Data Deletion</strong><br/>You may request the deletion of your account and personal data at any time via the "Settings" menu within the application.</p>
                </>
              )}
            </div>

            {/* ส่วนล่าง: ติ๊กถูก + ปุ่มกดยอมรับ */}
            <div style={{ padding: '24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--bg-body)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: '22px', height: '22px', accentColor: '#22c55e', cursor: 'pointer' }} 
                /> 
                <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>
                  {t.iAccept}
                </span>
              </label>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  onClick={() => { setShowTermsModal(false); setAgreeTerms(false); }} 
                  style={{ flex: 1, padding: '14px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-light)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: '0.2s', fontSize: '15px' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-body)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {t.cancelBtn}
                </button>
                <button 
                  type="button"
                  onClick={processRegistration}
                  disabled={!agreeTerms}
                  style={{ 
                    flex: 2, 
                    padding: '14px', 
                    background: agreeTerms ? '#22c55e' : 'var(--bg-body)', 
                    color: agreeTerms ? '#fff' : 'var(--text-muted)', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: 700, 
                    cursor: agreeTerms ? 'pointer' : 'not-allowed', 
                    transition: 'all 0.3s ease', 
                    fontSize: '15px',
                    boxShadow: agreeTerms ? '0 8px 16px -4px rgba(34, 197, 94, 0.4)' : 'none'
                  }}
                >
                  {t.acceptBtn}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  );
}