import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 🚀 นำเข้าเครื่องมือจาก Google Library ที่เพิ่งติดตั้ง
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
    acceptTerms: "ฉันยอมรับข้อกำหนดการใช้งาน และนโยบายการเก็บรักษาข้อมูลส่วนบุคคล (PDPA)",
    termsError: "กรุณากดตกลงและยินยอมตามข้อกำหนดก่อนสมัครสมาชิก"
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
    acceptTerms: "I accept the Terms of Service and Data Privacy Policy (PDPA)",
    termsError: "Please accept the terms and privacy policy before signing up."
  }
};

// 🔑 ก้อนปุ่ม Google แยกออกมาด้านนอกเพื่อให้สามารถใช้ Hook ของไลบรารีได้
function GoogleLoginButton() {
  const navigate = useNavigate();

  // ⚡ ฟังก์ชันเรียกเปิดหน้าต่างล็อกอินของ Google ของจริง
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // เมื่อล็อกอินผ่าน Google สำเร็จ จะได้ Access Token มา -> นำไปส่งดึงโปรไฟล์จริงต่อทันที
        const res = await fetch('https://www.googleapis.com/oauth2/0.3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();

        // 🎯 ได้ข้อมูลจริงมาแล้ว! (อีเมล, ชื่อ, รูปโปรไฟล์) เอามาเซฟเข้าระบบเว็บเรา
        localStorage.setItem('bizflow_session', googleUser.email);
        localStorage.setItem('bizflow_profile_name', googleUser.name);
        localStorage.setItem('bizflow_profile_image', googleUser.picture); // เก็บรูปโปรไฟล์ของ Google ไว้ใช้ได้ด้วย

        // พาวิ่งเข้าหน้าแดชบอร์ด
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
      onClick={() => loginWithGoogle()} // สั่งทำงานเมื่อคลิกปุ่ม G
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

  // 🔴 🔴 🔴 สำคัญมาก: ใส่กุญแจ Client ID ของคุณที่ได้จาก Google Cloud Console ที่นี่ 🔴 🔴 🔴
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
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) { alert(t.termsError); return; }
    const existingUsers = JSON.parse(localStorage.getItem('bizflow_users') || '[]');
    if (existingUsers.some((user: any) => user.email === email)) {
      alert(language === 'th' ? 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น' : 'Email already in use.');
      return;
    }
    const newUser = { id: `USR-${Date.now()}`, fullName, phone, email, password, role: 'Admin', createdAt: new Date().toISOString() };
    existingUsers.push(newUser);
    localStorage.setItem('bizflow_users', JSON.stringify(existingUsers));
    alert(language === 'th' ? 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ' : 'Registration successful! Please log in.');
    setIsRegistering(false); 
    setPassword('');
    setAgreeTerms(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
    // 🔒 ครอบระบบหน้าล็อกอินทั้งหมดด้วย GoogleOAuthProvider สำหรับการยืนยันตัวตนสิทธิ์เข้าถึงของแอป
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

            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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

              {isRegistering ? (
                <div className="login-options" style={{ marginBottom: '24px', marginTop: '8px' }}>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} style={{ marginTop: '4px', width: '16px', height: '16px', accentColor: 'var(--accent)' }} required /> 
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t.acceptTerms}</span>
                  </label>
                </div>
              ) : (
                <div className="login-options">
                  <label className="checkbox-label"><input type="checkbox" /> {t.remember}</label>
                  <a href="#" className="forgot-link">{t.forgot}</a>
                </div>
              )}

              <button type="submit" className="btn-login">{isRegistering ? t.signUp : t.signIn}</button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>{t.orContinue}</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            </div>

            {/* แถบปุ่มล็อกอินโซเชียลมีเดีย */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {/* 🟢 เรียกใช้ปุ่ม Google OAuth ตัวจริงที่แยกฟังก์ชันไว้ด้านบน */}
              <GoogleLoginButton />
              
              <button type="button" onClick={() => handleSocialLogin('LINE')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', borderRadius: '14px', border: '1px solid rgba(6, 199, 85, 0.2)', background: 'rgba(6, 199, 85, 0.08)', color: '#06C755', cursor: 'pointer', transition: '0.2s', fontSize: '18px' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(6, 199, 85, 0.15)'} onMouseOut={(e) => e.currentTarget.style.background='rgba(6, 199, 85, 0.08)'}>💬</button>
              <button type="button" onClick={() => handleSocialLogin('Apple')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', cursor: 'pointer', transition: '0.2s', fontSize: '20px' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.15)'} onMouseOut={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.05)'}></button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
              {isRegistering ? t.alreadyHave : t.dontHave}
              <button type="button" onClick={() => { setIsRegistering(!isRegistering); setPassword(''); setAgreeTerms(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
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
    </GoogleOAuthProvider>
  );
}