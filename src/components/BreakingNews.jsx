import React, { useState, useEffect } from 'react';
import { getRelativeTimeBn } from '../utils/dateUtils';

export default function BreakingNews({ articles }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const breakingList = articles ? articles.slice(0, 8) : [];

  useEffect(() => {
    if (breakingList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [breakingList.length]);

  if (!breakingList || breakingList.length === 0) return null;

  const currentStory = breakingList[currentIndex] || breakingList[0];

  return (
    <div className="breaking-bar">
      <div className="site-container breaking-inner">
        <div className="breaking-tag">
          <span className="live-bullet"></span>
          <span className="breaking-text">তাজা খবর</span>
        </div>

        <div className="breaking-content">
          <a
            href={currentStory.url}
            target="_blank"
            rel="noopener noreferrer"
            className="breaking-headline-link"
            key={currentStory.id}
          >
            <span className="breaking-source" style={{ color: currentStory.badgeColor || '#D91A2A' }}>
              [{currentStory.source}]
            </span>
            <span className="breaking-title">{currentStory.title}</span>
            <span className="breaking-time">{getRelativeTimeBn(currentStory.publishedAt)}</span>
          </a>
        </div>

        {/* Ticker Controls */}
        <div className="breaking-controls">
          <button
            className="ticker-btn"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + breakingList.length) % breakingList.length)}
            title="পূর্ববর্তী খবর"
            aria-label="Previous Headline"
          >
            ‹
          </button>
          <span className="ticker-count">
            {currentIndex + 1}/{breakingList.length}
          </span>
          <button
            className="ticker-btn"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % breakingList.length)}
            title="পরবর্তী খবর"
            aria-label="Next Headline"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
