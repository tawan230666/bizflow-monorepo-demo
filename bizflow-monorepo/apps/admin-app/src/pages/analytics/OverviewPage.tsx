import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OverviewPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [branch, setBranch] = useState('bkk');

  const branchData: Record<string, any> = {
    bkk: {
      name: 'กรุงเทพฯ (HQ)',
      sales: 12450,
      orders: 84,
      customers: 142,
      customerTraffic: 180,
      newCustomers: 68,
      returningCustomers: 112,
      profit: 4100,
      wage: 2850,
      costOfGoods: 5500,
      topMarginItem: 'ชาเฉาก๊วย',
    },
    cnx: {
      name: 'เชียงใหม่',
      sales: 8200,
      orders: 45,
      customers: 89,
      customerTraffic: 132,
      newCustomers: 50,
      returningCustomers: 82,
      profit: 2500,
      wage: 1800,
      costOfGoods: 3900,
      topMarginItem: 'ชาเฉาก๊วย',
    },
    hkt: {
      name: 'ภูเก็ต',
      sales: 15600,
      orders: 112,
      customers: 210,
      customerTraffic: 290,
      newCustomers: 118,
      returningCustomers: 172,
      profit: 5800,
      wage: 3200,
      costOfGoods: 6600,
      topMarginItem: 'ชาเย็น',
    },
  };

  const branchPerformance = Object.entries(branchData)
    .map(([key, value]) => ({ id: key, ...value }))
    .sort((a, b) => b.sales - a.sales);

  const currentKPI = branchData[branch];
  const averageOrderValue = currentKPI.orders ? currentKPI.sales / currentKPI.orders : 0;
  const newPercent = Math.round((currentKPI.newCustomers / currentKPI.customerTraffic) * 100);
  const returningPercent = 100 - newPercent;
  const laborPercent = Math.round((currentKPI.wage / currentKPI.sales) * 100);
  const cogsPercent = Math.round((currentKPI.costOfGoods / currentKPI.sales) * 100);
  const netMarginPercent = Math.round((currentKPI.profit / currentKPI.sales) * 100);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className="page-container" style={{ maxWidth: '1440px', margin: '0 auto', animation: 'pageEnter 0.5s ease-out forwards' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            margin: 0,
            background: 'linear-gradient(90deg, var(--text-main), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CEO Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', margin: 0 }}>
            ภาพรวมระดับสูงสำหรับผู้บริหาร: ยอดสาขา ต้นทุน กำไร และกลยุทธ์ที่ต้องลงมือวันนี้
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: '9999px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            <option value="bkk">📍 กรุงเทพฯ (HQ)</option>
            <option value="cnx">📍 เชียงใหม่</option>
            <option value="hkt">📍 ภูเก็ต</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--profit)', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '14px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.3)' }}></div>
            LIVE • {timeString}
          </div>
        </div>
      </div>

      {/* TOP 4 KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ borderTop: '3px solid #6366f1' }}>
          <div style={{ fontSize: '12px', letterSpacing: '1px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>ยอดขายสาขา</div>
          <div className="mono" style={{ fontSize: '34px', fontWeight: 800 }}>฿{currentKPI.sales.toLocaleString()}</div>
          <p style={{ margin: '12px 0 0', color: 'var(--text-muted)' }}>ยอดขายวันนี้ตามสาขาที่เลือก</p>
        </div>

        <div className="card" style={{ borderTop: '3px solid #3b82f6' }}>
          <div style={{ fontSize: '12px', letterSpacing: '1px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Customer Reach</div>
          <div className="mono" style={{ fontSize: '34px', fontWeight: 800 }}>{currentKPI.customerTraffic}</div>
          <p style={{ margin: '12px 0 0', color: 'var(--text-muted)' }}>ลูกค้าที่เข้าร้านวันนี้</p>
        </div>

        <div className="card" style={{ borderTop: '3px solid #eab308' }}>
          <div style={{ fontSize: '12px', letterSpacing: '1px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Orders</div>
          <div className="mono" style={{ fontSize: '34px', fontWeight: 800 }}>{currentKPI.orders}</div>
          <p style={{ margin: '12px 0 0', color: 'var(--text-muted)' }}>จำนวนบิลที่วางขายแล้ว</p>
        </div>

        <div className="card" style={{ borderTop: '3px solid #22c55e' }}>
          <div style={{ fontSize: '12px', letterSpacing: '1px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Net Margin</div>
          <div className="mono" style={{ fontSize: '34px', fontWeight: 800, color: 'var(--profit)' }}>฿{currentKPI.profit.toLocaleString()}</div>
          <p style={{ margin: '12px 0 0', color: 'var(--text-muted)' }}>กำไรสุทธิหลังหักค่าแรงและต้นทุน</p>
        </div>
      </div>

      {/* 🌟 NEW: COMPANY GOALS & OKRs TRACKING */}
      <div className="card" style={{ marginBottom: '40px', padding: '32px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, var(--bg-card) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🎯</span> Q2 / 2026 Company Target
            </h3>
            <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>เป้าหมายยอดขายรวมทุกสาขาประจำไตรมาสที่ 2</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Progress</div>
            <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent)' }}>85%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '16px', background: 'var(--bg-main)', borderRadius: '999px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
          <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '999px', transition: 'width 1s ease-in-out' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '14px', fontWeight: 600 }}>
          <span className="mono" style={{ color: 'var(--text-main)' }}>฿8,500,000 (Actual)</span>
          <span className="mono" style={{ color: 'var(--text-muted)' }}>฿10,000,000 (Goal)</span>
        </div>
      </div>

      {/* 🌟 NEW: STRATEGIC METRICS (Runway, CAC/LTV, Fraud) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Cash Runway & Burn Rate */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>💸</span> Cash & Runway
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Burn Rate (รายจ่าย/เดือน)</div>
              <div className="mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--loss)', marginTop: '4px' }}>฿250k</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cash Runway</div>
              <div className="mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--profit)', marginTop: '4px' }}>14.5 Mos</div>
            </div>
          </div>
        </div>

        {/* CAC vs LTV */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🧲</span> CAC vs LTV
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>CAC (ต้นทุนหาลูกค้าใหม่)</div>
              <div className="mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--warning)', marginTop: '4px' }}>฿120</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>LTV (มูลค่าตลอดชีพ)</div>
              <div className="mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--profit)', marginTop: '4px' }}>฿1,500</div>
            </div>
          </div>
        </div>

        {/* Fraud & Loss Prevention */}
        <div className="card" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, var(--bg-card) 100%)' }}>
          <div style={{ fontSize: '12px', color: 'var(--loss)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🚨</span> Fraud Prevention
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Void / Cancel Rate</div>
              <div className="mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>1.2% <span style={{fontSize: '12px', color: 'var(--profit)'}}>ปกติ</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Discount Abuse</div>
              <div className="mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>0.5%</div>
            </div>
          </div>
        </div>

      </div>

      {/* MULTI-BRANCH & FINANCIAL HEALTH (ORIGINAL) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ display: 'grid', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>📊 Multi-Branch Performance</h3>
                <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>อันดับสาขา Top 3 และสาขา Bottom เพื่อเน้นบริหารบูทพ่วง อัดงบ หรือเข้าไปช่วยเหลือ</p>
              </div>
              <span style={{ padding: '8px 14px', borderRadius: '9999px', background: 'rgba(103, 232, 249, 0.12)', color: 'var(--accent)', fontWeight: 700, fontSize: '13px' }}>Leaderboards</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {branchPerformance.map((branchSummary, index) => (
              <div key={branchSummary.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '18px 20px', borderRadius: '16px', background: index < 3 ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 68, 68, 0.08)', border: `1px solid ${index < 3 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: index < 3 ? 'var(--text-main)' : 'var(--loss)' }}>{index < 3 ? `Top ${index + 1}` : 'Bottom'}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>{branchSummary.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>ยอดขาย</div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>฿{branchSummary.sales.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Average Order Value</div>
              <div style={{ fontSize: '32px', fontWeight: 800 }}>฿{averageOrderValue.toFixed(0)}</div>
              <div style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>ยอดใช้จ่ายเฉลี่ยต่อบิล</div>
            </div>
            <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Customer Trends</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{newPercent}%</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 700, marginTop: '4px' }}>New</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--profit)' }}>{returningPercent}%</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 700, marginTop: '4px' }}>Returning</div>
                </div>
              </div>
              <div style={{ marginTop: '12px', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ width: `${newPercent}%`, height: '100%', background: 'var(--accent)' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>🍩 Financial Health & Cost Breakdown</h3>
                <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>สัดส่วนรายได้แบ่งเป็น COGS, Labor และ Net Margin</p>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>Net Margin {netMarginPercent}%</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
              <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: `conic-gradient(var(--loss) 0 ${(cogsPercent / 100) * 360}deg, var(--warning) ${(cogsPercent / 100) * 360}deg ${((cogsPercent + laborPercent) / 100) * 360}deg, var(--profit) ${((cogsPercent + laborPercent) / 100) * 360}deg 360deg)`, display: 'grid', placeItems: 'center' }}>
                <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'var(--bg-main)', display: 'grid', placeItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>{netMarginPercent}%</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Net Margin</div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ width: '12px', height: '12px', background: 'var(--loss)', borderRadius: '50%' }}></span>
                      <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>COGS</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{cogsPercent}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ width: '12px', height: '12px', background: 'var(--warning)', borderRadius: '50%' }}></span>
                      <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>Labor</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{laborPercent}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ width: '12px', height: '12px', background: 'var(--profit)', borderRadius: '50%' }}></span>
                      <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>Net Margin</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{netMarginPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>🤖 Executive AI Recommendations</h3>
                <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>คำแนะนำเชิงกลยุทธ์สำหรับ CEO และทีมบริหาร</p>
              </div>
            </div>
            <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
              <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(103, 232, 249, 0.12)' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>• สาขาเชียงใหม่มีสัดส่วนค่าแรงสูงกว่าค่าเฉลี่ย 5%.</strong>
                <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>แนะนำให้ปรับตารางเวลาเข้างาน และลดโอทีในช่วงบ่ายเพื่อควบคุม Labor Cost.</div>
              </div>
              <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34, 197, 94, 0.12)' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>• เมนูชาเฉาก๊วยมีกำไรสูงสุด.</strong>
                <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>ทำโปรโมชั่น Cross-sell จับคู่กับอาหารจานหลักในทุกสาขา เพื่อเพิ่มรายได้ต่อบิล.</div>
              </div>
              <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245, 158, 11, 0.12)' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>• ลูกค้าใหม่คิดเป็น {newPercent}% ของการเข้าร้าน.</strong>
                <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>ปรับแคมเปญ Membership และ CRM เพื่อพลักดันการซื้อซ้ำและลดต้นทุนการได้ลูกค้าใหม่.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 NEW: MENU ENGINEERING MATRIX */}
      <div className="card" style={{ padding: '32px', marginBottom: '40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🧩</span> Menu Engineering (BCG Matrix)
          </h3>
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>วิเคราะห์ศักยภาพของเมนูอาหารตามยอดขายและกำไร (Popularity vs. Profitability)</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--profit)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌟</span> Stars (ดาวเด่น)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>ขายดีมาก + กำไรสูงมาก</div>
            <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '15px' }}>ชาเฉาก๊วย, กะเพราหมูกรอบ</div>
          </div>

          <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#3b82f6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🐎</span> Plowhorses (ม้างาน)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>ขายดีมาก + แต่กำไรน้อย</div>
            <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '15px' }}>ข้าวผัดปู, ผัดไทย</div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--warning)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>❓</span> Puzzles (ปริศนา)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>ขายไม่ค่อยดี + แต่กำไรสูงมาก</div>
            <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '15px' }}>อิตาเลียนโซดา, เค้กช็อกโกแลต</div>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--loss)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🐶</span> Dogs (หมาวัด)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>ขายไม่ดี + กำไรก็น้อย</div>
            <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '15px' }}>ซาลาเปา, ขนมจีบ</div>
          </div>

        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button className="quick-action-btn primary" onClick={() => navigate('/menu')}>
          <span style={{ fontSize: '16px' }}>🏪</span> เปิดหน้าจัดการสาขา
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/finance')}>
          <span>💰</span> ดูงบการเงิน
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/report')}>
          <span>📣</span> ดู Marketing & CRM
        </button>
      </div>
    </div>
  );
}