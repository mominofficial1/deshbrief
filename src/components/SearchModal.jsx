import React, { useState, useEffect, useRef } from 'react';
import { getRelativeTimeBn } from '../utils/dateUtils';

export default function SearchModal({ isOpen, onClose, allArticles }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const searchResults = trimmed
    ? allArticles.filter((art) => {
        return (
          art.title?.toLowerCase().includes(trimmed) ||
          art.description?.toLowerCase().includes(trimmed) ||
          art.source?.toLowerCase().includes(trimmed) ||
          art.category?.toLowerCase().includes(trimmed)
        );
      })
    : [];

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Header */}
        <div className="search-header">
          <div className="search-input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="search-input-field"
              placeholder="খবরের শিরোনাম, বিষয় বা সংবাদমাধ্যমের নাম লিখুন..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear-btn" onClick={() => setQuery('')}>
                ✕
              </button>
            )}
          </div>
          <button className="search-close-btn" onClick={onClose} title="বন্ধ করুন (Esc)">
            Esc
          </button>
        </div>

        {/* Search Results Body */}
        <div className="search-results-body">
          {query.trim() === '' ? (
            <div className="search-hints-wrap">
              <span className="search-hint-title">জনপ্রিয় অনুসন্ধান বিষয়:</span>
              <div className="search-tags">
                {['বাংলাদেশ', 'রাজনীতি', 'ক্রিকেট', 'শিক্ষা', 'অর্থনীতি', 'প্রযুক্তি', 'প্রথম আলো', 'ডেইলি স্টার'].map((tag) => (
                  <button key={tag} className="search-tag-chip" onClick={() => setQuery(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="search-empty-state">
              <div className="empty-search-icon">🔍</div>
              <h4>আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি</h4>
              <p>দয়া করে বানান পরীক্ষা করুন অথবা ভিন্ন কোনো শব্দ দিয়ে অনুসন্ধান করুন।</p>
            </div>
          ) : (
            <div className="search-results-list">
              <div className="search-result-count">
                "{query}" এর জন্য {searchResults.length}টি ফলাফল পাওয়া গেছে:
              </div>
              {searchResults.slice(0, 30).map((story) => (
                <a
                  key={story.id}
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="search-result-item"
                >
                  <div className="search-item-info">
                    <div className="search-item-meta">
                      <span
                        className="source-badge-solid"
                        style={{ backgroundColor: story.badgeColor || '#D91A2A' }}
                      >
                        {story.source}
                      </span>
                      <span className="search-item-cat">{story.category}</span>
                      <span className="search-item-time">{getRelativeTimeBn(story.publishedAt)}</span>
                    </div>
                    <h4 className="search-item-title">{story.title}</h4>
                    {story.description && (
                      <p className="search-item-desc">{story.description}</p>
                    )}
                  </div>
                  {story.image && (
                    <div className="search-item-thumb">
                      <img src={story.image} alt="" loading="lazy" />
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="search-modal-footer">
          <span>Esc দিয়ে বন্ধ করুন • যে কোনো খবরে ক্লিক করে মূল প্রতিবেদন পড়ুন</span>
        </div>
      </div>
    </div>
  );
}
