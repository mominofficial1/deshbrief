import React from 'react';
import { CATEGORIES_LIST } from '../utils/categoryUtils';

export default function Footer({ sources, onSelectCategory, onSelectSource, onOpenAbout }) {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top-grid">
          {/* Col 1: Brand & Disclaimer */}
          <div className="footer-col footer-col-brand">
            <div className="footer-logo-wrap">
              <img src="./deshbrief-logo.png" alt="DeshBrief" className="footer-logo-img" />
            </div>
            <p className="footer-tagline">
              সব গুরুত্বপূর্ণ খবর, এক নজরে। বাংলাদেশের নির্ভরযোগ্য শীর্ষ সংবাদমাধ্যমের সর্বশেষ আপডেট এক ঠিকানায়।
            </p>
            <div className="footer-disclaimer-box">
              <strong>ঘোষণা ও দায়মুক্তি:</strong> দেশব্রিফ একটি উন্মুক্ত সংবাদ সংগ্রাহক প্ল্যাটফর্ম। প্রতিটি সংবাদ ও ছবির কপিরাইট স্বত্বাধিকার সংশ্লিষ্ট মূল সংবাদমাধ্যমের। যে কোনো খবরে ক্লিক করে মূল প্রতিবেদন পড়ুন।
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">ক্যাটাগরি</h4>
            <div className="footer-link-list">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  className="footer-btn-link"
                  onClick={() => onSelectCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Publishers Directory */}
          <div className="footer-col">
            <h4 className="footer-heading">সংবাদমাধ্যম ও উৎস</h4>
            <div className="footer-link-list">
              {sources && sources.map((src) => (
                <a
                  key={src.id}
                  href={src.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-external-link"
                >
                  <span>{src.name}</span>
                  <span className="ext-arrow">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 4: Platform & Info */}
          <div className="footer-col">
            <h4 className="footer-heading">প্ল্যাটফর্ম</h4>
            <div className="footer-link-list">
              <button className="footer-btn-link" onClick={onOpenAbout}>
                আমাদের সম্পর্কে (About)
              </button>
              <button className="footer-btn-link" onClick={onOpenAbout}>
                গোপনীয়তা ও নীতিমালা (Privacy)
              </button>
              <button className="footer-btn-link" onClick={onOpenAbout}>
                স্বত্বাধিকার ও ডিসক্লেইমার
              </button>
              <a
                href="https://github.com/mominofficial/deshbrief"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-external-link"
                style={{ marginTop: '0.5rem', color: 'var(--color-crimson)', fontWeight: '600' }}
              >
                <span>GitHub Repository</span>
                <span className="ext-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            © {new Date().getFullYear()} DeshBrief (দেশব্রিফ) • সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="footer-bottom-right">
            100% Static Data Architecture • Powered by Official RSS & GitHub Pages
          </div>
        </div>
      </div>
    </footer>
  );
}
