import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="news-card skeleton-card">
      <div className="skeleton-media shimmer"></div>
      <div className="news-card-body">
        <div className="skeleton-meta shimmer"></div>
        <div className="skeleton-line shimmer" style={{ width: '88%' }}></div>
        <div className="skeleton-line shimmer" style={{ width: '96%' }}></div>
        <div className="skeleton-line shimmer" style={{ width: '60%' }}></div>
        <div className="skeleton-footer shimmer"></div>
      </div>
    </div>
  );
}
