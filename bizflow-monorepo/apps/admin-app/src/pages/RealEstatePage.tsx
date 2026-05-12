import React from 'react';
import './RealEstate.css'; // นำเข้า CSS เฉพาะของหน้านี้

export default function RealEstatePage() {
  return (
    <div className="re-container">
      {/* =========================================
          1. Navbar (แถบเมนูด้านบน)
          ========================================= */}
      <nav className="re-navbar">
        <div className="re-logo">
          <span className="re-logo-icon">🏠</span>
          Estate<span style={{ fontWeight: 800, color: '#2563EB' }}>Flow</span>
        </div>
        
        <div className="re-nav-links">
          <a href="#" className="active">Home</a>
          <a href="#">Properties</a>
          <a href="#">Agents</a>
          <a href="#">About Us</a>
        </div>
        
        <div className="re-nav-actions">
          <button className="re-btn-text">Sign In</button>
          <button className="re-btn-primary">Add Property</button>
        </div>
      </nav>

      {/* =========================================
          2. Hero Section (ส่วนหัวหลักของเว็บ)
          ========================================= */}
      <header className="re-hero">
        <div className="re-hero-content">
          <span className="re-badge">✨ Explore the best properties</span>
          <h1 className="re-title">
            Find Your Dream Home <br />
            With <span style={{ color: '#2563EB' }}>Confidence</span>
          </h1>
          <p className="re-subtitle">
            Discover a wide range of premium properties in top locations. 
            We make finding your perfect home simple, transparent, and fast.
          </p>
        </div>

        {/* =========================================
            3. Floating Search Bar (แถบค้นหาลอยตัว)
            ========================================= */}
        <div className="re-search-wrapper">
          <div className="re-search-bar">
            
            <div className="re-search-item">
              <span className="re-search-label">Location</span>
              <input type="text" placeholder="City, Neighborhood..." className="re-search-input" />
            </div>

            <div className="re-divider"></div>

            <div className="re-search-item">
              <span className="re-search-label">Property Type</span>
              <select className="re-search-input select">
                <option>All Types</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Villa</option>
              </select>
            </div>

            <div className="re-divider"></div>

            <div className="re-search-item">
              <span className="re-search-label">Price Range</span>
              <select className="re-search-input select">
                <option>$50k - $200k</option>
                <option>$200k - $500k</option>
                <option>$500k+</option>
              </select>
            </div>

            <button className="re-search-btn">
              🔍 Search
            </button>
          </div>
        </div>
      </header>

      {/* =========================================
          4. Image Showcase (รูปภาพสไตล์ Dribbble)
          ========================================= */}
      <div className="re-image-showcase">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Modern House Showcase" 
          className="re-hero-img"
        />
        {/* กล่องลอยตัว (Floating Badge) บนรูปภาพ */}
        <div className="re-floating-stats">
          <div className="stats-number">12k+</div>
          <div className="stats-text">Properties Listed</div>
        </div>
      </div>

    </div>
  );
}