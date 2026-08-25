import React, { useState } from 'react';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';

export default function NewsGrid({
  articles,
  loading,
  activeCategory,
  selectedSourceName,
  onResetFilters
}) {
  const [displayCount, setDisplayCount] = useState(24);

  if (loading) {
    return (
      <section className="news-feed-section">
        <div className="site-container">
          <div className="section-title-row">
            <div className="section-headline-group">
              <span className="accent-bar"></span>
              <h2 className="section-heading">সংবাদ লোড হচ্ছে...</h2>
            </div>
          </div>
          <div className="news-grid-container">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!articles || articles.length === 0) {
    return (
      <section className="news-feed-section">
        <div className="site-container">
          <div className="empty-state-card">
            <div className="empty-state-icon">📰</div>
            <h3 className="empty-state-title">এই মুহূর্তে কোনো সংবাদ পাওয়া যাচ্ছে না</h3>
            <p className="empty-state-desc">
              আপনার নির্বাচিত ফিল্টার বা ক্যাটাগরির সাথে সামঞ্জস্যপূর্ণ কোনো খবর পাওয়া যায়নি।
            </p>
            <button className="btn btn-crimson" onClick={onResetFilters}>
              সকল সংবাদ দেখুন
            </button>
          </div>
        </div>
      </section>
    );
  }

  const visibleArticles = articles.slice(0, displayCount);
  const hasMore = displayCount < articles.length;

  return (
    <section className="news-feed-section">
      <div className="site-container">
        <div className="section-title-row">
          <div className="section-headline-group">
            <span className="accent-bar"></span>
            <h2 className="section-heading">
              {activeCategory} {selectedSourceName ? `• ${selectedSourceName}` : ''}
            </h2>
            <span className="section-subtitle">
              ({articles.length}টি সংবাদের তালিকা)
            </span>
          </div>

          {(activeCategory !== 'সর্বশেষ' || selectedSourceName) && (
            <button className="btn-filter-clear" onClick={onResetFilters}>
              ✕ ফিল্টার মুছুন
            </button>
          )}
        </div>

        {/* Editorial Multi-column Grid */}
        <div className="news-grid-container">
          {visibleArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="load-more-wrap">
            <button
              className="btn btn-outline-crimson btn-load-more"
              onClick={() => setDisplayCount((prev) => prev + 24)}
            >
              <span>আরও সংবাদ লোড করুন (+২৪)</span>
              <span className="down-arrow">↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
