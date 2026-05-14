import React, { useRef, useState } from 'react';
import './RealEstate.css';

const navLinks = ['ร้าน', 'Mac', 'iPad', 'iPhone', 'Watch', 'AirPods', 'TV และบ้าน', 'ความบันเทิง', 'อุปกรณ์เสริม', 'บริการช่วยเหลือ'];

const categoryIcons = [
  { id: 1, name: 'Mac', icon: '💻', isNew: false },
  { id: 2, name: 'iPhone', icon: '📱', isNew: true },
  { id: 3, name: 'iPad', icon: '📝', isNew: false },
  { id: 4, name: 'Apple Watch', icon: '⌚', isNew: false },
  { id: 5, name: 'AirPods', icon: '🎧', isNew: false },
  { id: 6, name: 'AirTag', icon: '💿', isNew: false },
  { id: 7, name: 'Apple TV 4K', icon: '📺', isNew: false },
  { id: 8, name: 'HomePod', icon: '🔊', isNew: false },
  { id: 9, name: 'อุปกรณ์เสริม', icon: '⌨️', isNew: false },
];

const latestProducts = [
  {
    id: 1,
    badge: 'ใหม่',
    title: 'iPhone 17 Pro',
    price: 'เริ่มต้นที่ ฿41,900',
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    badge: 'ใหม่',
    title: 'MacBook Air',
    price: 'เริ่มต้นที่ ฿39,900',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    badge: '',
    title: 'iPad Pro',
    price: 'เริ่มต้นที่ ฿32,900',
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    badge: 'ใหม่',
    title: 'Apple Watch Series 10',
    price: 'เริ่มต้นที่ ฿14,900',
    img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600&auto=format&fit=crop'
  }
];

export default function RealEstatePage() {
  
  // 🚀 ฟังก์ชันสำหรับทำ "คลิกค้างแล้วลากเพื่อเลื่อน" (Drag to Scroll)
  const useDragToScroll = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
      if (!scrollRef.current) return;
      setIsDown(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeaveOrUp = () => setIsDown(false);

    const onMouseMove = (e: React.MouseEvent) => {
      if (!isDown || !scrollRef.current) return;
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2; // ความเร็วในการลาก
      scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return { ref: scrollRef, onMouseDown, onMouseLeave: onMouseLeaveOrUp, onMouseUp: onMouseLeaveOrUp, onMouseMove };
  };

  const navScroll = useDragToScroll();
  const productScroll = useDragToScroll();

  return (
    <div className="apple-container">
      
      {/* 1. Global Navigation (แถบเมนูด้านบนสุด) */}
      <nav className="apple-globalnav">
        <ul className="apple-globalnav-list">
          <li><a href="#" style={{ fontSize: '16px' }}></a></li>
          {navLinks.map(link => (
            <li key={link}><a href="#">{link}</a></li>
          ))}
          <li><a href="#" style={{ fontSize: '14px' }}>🔍</a></li>
          <li><a href="#" style={{ fontSize: '14px' }}>🛍️</a></li>
        </ul>
      </nav>

      {/* 2. Store Header (ข้อความตัวใหญ่) */}
      <header className="apple-store-header">
        <h1 className="apple-store-title">ร้านของเรา</h1>
        <h2 className="apple-store-subtitle">คือที่ที่ดีที่สุดในการซื้อ<br/>ผลิตภัณฑ์ที่คุณรัก</h2>
      </header>

      {/* 3. Category Icons (เลื่อนแนวนอน) */}
      <div className="apple-chapternav-wrapper">
        <div 
          className="apple-chapternav"
          {...navScroll}
        >
          <div className="apple-chapternav-items">
            {categoryIcons.map(item => (
              <div key={item.id} className="apple-chapternav-item">
                <div className="apple-chapternav-icon">{item.icon}</div>
                <span className="apple-chapternav-label">{item.name}</span>
                {item.isNew && <span className="apple-chapternav-new">ใหม่</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Latest Products Section (การ์ดผลิตภัณฑ์ลากเลื่อนได้) */}
      <section className="apple-product-section">
        <h2 className="apple-section-title">
          ผลิตภัณฑ์ล่าสุด <span style={{ color: '#86868b' }}>มาดูกันว่ามีอะไรใหม่บ้าง</span>
        </h2>

        <div className="apple-product-carousel" {...productScroll}>
          {latestProducts.map(product => (
            <div key={product.id} className="apple-product-card">
              <div className="apple-card-badge">{product.badge || '\u00A0'}</div>
              <h3 className="apple-card-title">{product.title}</h3>
              <p className="apple-card-price">{product.price}</p>
              <img src={product.img} alt={product.title} className="apple-card-img" />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Help Section (ลากเลื่อนได้เช่นกัน) */}
      <section className="apple-product-section" style={{ paddingTop: 0 }}>
        <h2 className="apple-section-title">
          ความช่วยเหลืออยู่ที่นี่ <span style={{ color: '#86868b' }}>เมื่อไหร่และที่ไหนก็ตามที่คุณต้องการ</span>
        </h2>

        <div className="apple-product-carousel">
          <div className="apple-product-card" style={{ minWidth: '400px' }}>
            <div className="apple-card-badge" style={{ color: '#1d1d1f' }}>APPLE SPECIALIST</div>
            <h3 className="apple-card-title">เลือกซื้อสินค้ากับ<br/>Specialist ผ่านทางวิดีโอ</h3>
            <p className="apple-card-price" style={{ color: '#0066cc', marginTop: '8px' }}>ขอความช่วยเหลือ {'>'}</p>
          </div>
          <div className="apple-product-card" style={{ minWidth: '400px' }}>
            <div className="apple-card-badge" style={{ color: '#1d1d1f' }}>APPLE TV+</div>
            <h3 className="apple-card-title">พบกับความบันเทิง<br/>ระดับแนวหน้าได้ที่นี่</h3>
            <p className="apple-card-price" style={{ color: '#0066cc', marginTop: '8px' }}>ทดลองใช้ฟรี {'>'}</p>
          </div>
        </div>
      </section>

    </div>
  );
}