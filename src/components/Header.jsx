import React, { useState, useEffect } from 'react';
import { getDhakaCurrentDateBn } from '../utils/dateUtils';

export default function Header({
  darkMode,
  toggleDarkMode,
  onOpenSearch,
  onOpenAbout,
  activeCategory,
  onSelectCategory,
  totalArticles,
  updatedAt
}) {
  const [dateText, setDateText] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setDateText(getDhakaCurrentDateBn());
  }, []);

  return (
    <header className="site-header">
      {/* Top Meta Bar */}
      <div className="top-meta-bar">
        <div className="site-container top-meta-inner">
          <div className="meta-left">
            <span className="live-pulse-dot"></span>
            <span className="meta-date">{dateText || 'ঢাকা'}</span>
            <span className="meta-divider">•</span>
            <span className="meta-stat">সর্বশেষ {totalArticles}টি গুরুত্বপূর্ণ সংবাদ</span>
          </div>

          <div className="meta-right">
            <button className="meta-btn-link" onClick={onOpenAbout}>
              আমাদের সম্পর্কে ও নীতিমালা
            </button>
            <span className="meta-divider">•</span>
            <span className="meta-tagline">সব গুরুত্বপূর্ণ খবর, এক নজরে।</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-navbar">
        <div className="site-container navbar-inner">
          {/* Logo */}
          <div className="brand-wrap">
            <a href="#" className="brand-link" onClick={(e) => { e.preventDefault(); onSelectCategory('সর্বশেষ'); }}>
              <img 
                src="./deshbrief-logo.png" 
                alt="DeshBrief Logo" 
                className="brand-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  document.getElementById('brand-text-fallback').style.display = 'flex';
                }}
              />
              <div id="brand-text-fallback" className="brand-text-fallback" style={{ display: 'none' }}>
                <span className="brand-name-main">Desh<span className="text-crimson">Brief</span></span>
                <span className="brand-sub-tag">সব খবর এক নজরে</span>
              </div>
            </a>
          </div>

          {/* Right Header Actions */}
          <div className="header-actions">
            {/* Search Trigger Button */}
            <button 
              className="action-btn search-trigger-btn"
              onClick={onOpenSearch}
              title="খবর অনুসন্ধান করুন (Ctrl + K)"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="search-btn-label">খবর খুঁজুন...</span>
              <span className="search-shortcut-badge">⌘K</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              className="action-btn theme-toggle-btn"
              onClick={toggleDarkMode}
              title={darkMode ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`action-btn mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="site-container mobile-drawer-inner">
            <div className="mobile-search-row">
              <button 
                className="btn btn-crimson-outline" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }}
              >
                🔍 সংবাদ অনুসন্ধান করুন
              </button>
            </div>

            <div className="mobile-info-links">
              <button className="mobile-link" onClick={() => { setMobileMenuOpen(false); onOpenAbout(); }}>
                📖 দেশব্রিফ পরিচিতি ও নীতিমালা
              </button>
              <div className="mobile-date-badge">
                {dateText}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
