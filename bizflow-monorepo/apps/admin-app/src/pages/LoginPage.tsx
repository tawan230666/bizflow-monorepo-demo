import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  
  // State สลับหน้า Sign In / Sign Up
  const [isRegistering, setIsRegistering] = useState(false);

  // State สำหรับฟอร์ม
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State เพิ่มเติมสำหรับข้อมูลส่วนบุคคล (สมัครสมาชิก)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // ฟังก์ชัน: สมัครสมาชิก (ลงทะเบียน)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem('bizflow_users') || '[]');
    
    if (existingUsers.some((user: any) => user.email === email)) {
      alert('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น');
      return;
    }

    const newUser = {
      id: `USR-${Date.now()}`,
      fullName,
      phone,
      email,
      password,
      role: 'Admin',
      createdAt: new Date().toISOString()
    };

    existingUsers.push(newUser);
    localStorage.setItem('bizflow_users', JSON.stringify(existingUsers));
    
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    setIsRegistering(false);
    setPassword('');
  };

  // ฟังก์ชัน: เข้าสู่ระบบผ่าน Email ปกติ
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem('bizflow_users') || '[]');
    const foundUser = existingUsers.find((user: any) => user.email === email && user.password === password);

    if (foundUser || (email === 'admin@bizflow.com' && password === '12345678')) {
      localStorage.setItem('bizflow_session', email);
      setTimeout(() => navigate('/overview'), 500);
    } else {
      alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง!');
    }
  };

  // 🚀 ฟังก์ชัน: เข้าสู่ระบบด้วย Social Accounts (Google, LINE, Apple)
  const handleSocialLogin = (provider: string) => {
    // จำลองการล็อกอินสำเร็จผ่าน Social
    localStorage.setItem('bizflow_session', `${provider.toLowerCase()}_user@bizflow.com`);
    
    // สามารถเซ็ตชื่อให้ตรงกับ Provider ที่กดได้ด้วย
    localStorage.setItem('bizflow_profile_name', `${provider} User`);
    
    // หน่วงเวลาจำลองการโหลด แล้วพาเข้าหน้า Dashboard
    setTimeout(() => {
      navigate('/overview');
    }, 500);
  };

  return (
    <div className="login-wrapper">
      
      {/* ฝั่งซ้าย: ฟอร์ม Login / Register */}
      <div className="login-left">
        <div className="login-logo">BizFlow</div>
        
        <div className="login-form-container">
          <h1 className="login-title">{isRegistering ? 'Create an account' : 'Welcome back'}</h1>
          <p className="login-subtitle">
            {isRegistering 
              ? 'Enter your personal details to get started.' 
              : 'Please enter your details to sign in.'}
          </p>

          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            
            {isRegistering && (
              <>
                <div className="input-group">
                  <label className="input-label">Full Name (ชื่อ-นามสกุล)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="John Doe" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number (เบอร์โทรศัพท์)</label>
                  <input 
                    type="tel" 
                    className="input-field" 
                    placeholder="08X-XXX-XXXX" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <label className="input-label">Email address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="admin@bizflow.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isRegistering && (
              <div className="login-options">
                <label className="checkbox-label">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn-login">
              {isRegistering ? 'Sign up' : 'Sign in'}
            </button>
          </form>

          {/* 🚀 เพิ่มส่วน Social Login */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>
              OR CONTINUE WITH
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {/* Google */}
            <button 
              onClick={() => handleSocialLogin('Google')} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)', cursor: 'pointer', transition: '0.2s' }} 
              onMouseOver={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.08)'} 
              onMouseOut={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.03)'}
            >
              <span style={{ background: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: '18px' }}>G</span>
            </button>
            
            {/* LINE */}
            <button 
              onClick={() => handleSocialLogin('LINE')} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', borderRadius: '14px', border: '1px solid rgba(6, 199, 85, 0.2)', background: 'rgba(6, 199, 85, 0.08)', color: '#06C755', cursor: 'pointer', transition: '0.2s', fontSize: '18px' }} 
              onMouseOver={(e) => e.currentTarget.style.background='rgba(6, 199, 85, 0.15)'} 
              onMouseOut={(e) => e.currentTarget.style.background='rgba(6, 199, 85, 0.08)'}
            >
              💬
            </button>
            
            {/* Apple */}
            <button 
              onClick={() => handleSocialLogin('Apple')} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', cursor: 'pointer', transition: '0.2s', fontSize: '20px' }} 
              onMouseOver={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.2)'} 
              onMouseOut={(e) => e.currentTarget.style.background='rgba(255, 255, 255, 0.1)'}
            >
              
            </button>
          </div>
          {/* สิ้นสุดส่วน Social Login */}

          {/* ปุ่มสลับหน้า (Toggle) ระหว่าง Login <-> Register */}
          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setPassword('');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
            >
              {isRegistering ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>

      {/* ฝั่งขวา: กราฟิกตกแต่ง */}
      <div className="login-right">
        <div className="login-pattern"></div>
        
        {/* Mockup จำลองหน้า Dashboard ลอยๆ */}
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
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 12px' }}>Manage everything in one place</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Streamline your business operations with our all-in-one platform.</p>
        </div>
      </div>

    </div>
  );
}