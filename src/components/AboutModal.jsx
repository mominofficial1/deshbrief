import React, { useEffect } from 'react';

export default function AboutModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="about-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="about-modal-header">
          <div className="brand-wrap">
            <img src="./deshbrief-logo.png" alt="DeshBrief" style={{ height: '36px', objectFit: 'contain' }} />
          </div>
          <button className="search-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="about-modal-body">
          <h3 className="about-modal-heading">দেশব্রিফ (DeshBrief) সম্পর্কে</h3>
          <p className="about-lead-text">
            <strong>দেশব্রিফ (DeshBrief)</strong> হলো বাংলাদেশের একটি নিরপেক্ষ ও আধুনিক সংবাদ সংগ্রাহক (News Aggregator) পোর্টাল।
          </p>

          <div className="about-card-section">
            <h4>📌 আমাদের কার্যপদ্ধতি ও লক্ষ্য</h4>
            <p>
              দেশব্রিফ নিজে কোনো সংবাদ তৈরি বা পুনর্লিখন করে না। এটি বাংলাদেশের শীর্ষ ও নির্ভরযোগ্য মূলধারার সংবাদমাধ্যমসমূহের উন্মুক্ত ও অফিসিয়াল RSS/Atom ফিড থেকে স্বয়ংক্রিয়ভাবে সর্বশেষ গুরুত্বপূর্ণ শিরোনাম ও সংক্ষিপ্ত বিবরণ সংগ্রহ করে এক জায়গায় প্রদর্শন করে।
            </p>
          </div>

          <div className="about-card-section">
            <h4>⚖️ কপিরাইট ও উৎস স্বত্বাধিকার নীতি (Disclaimer)</h4>
            <p>
              দেশব্রিফে প্রদর্শিত প্রতিটি সংবাদের মূল স্বত্বাধিকার ও কপিরাইট সম্পূর্ণভাবে সংশ্লিষ্ট প্রকাশক ও সংবাদমাধ্যমের। যে কোনো সংবাদে ক্লিক করলে ব্যবহারকারী সরাসরি মূল সংবাদমাধ্যমের মূল প্রতিবেদনে পৌঁছে যাবেন।
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              "DeshBrief is an independent news aggregation platform that brings together headlines from publicly available publisher feeds and directs readers to the original news source."
            </p>
          </div>

          <div className="about-card-section">
            <h4>⚡ প্রযুক্তি ও ডাটা আর্কিটেকচার</h4>
            <p>
              দেশব্রিফ একটি ১০০% স্ট্যাটিক আর্কিটেকচারের উপর নির্মিত। এতে কোনো ট্র্যাডিশনাল ডাটাবেজ ব্যবহার করা হয়নি। প্রতি ১৫-৩০ মিনিট অন্তর গিটহাব অ্যাকশনস (GitHub Actions) স্বয়ংক্রিয়ভাবে নতুন ফিড বিশ্লেষণ করে এবং প্ল্যাটফর্ম আপডেট রাখে।
            </p>
          </div>
        </div>

        <div className="about-modal-footer">
          <button className="btn btn-crimson" onClick={onClose}>
            বুঝেছি, সংবাদে ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
}
