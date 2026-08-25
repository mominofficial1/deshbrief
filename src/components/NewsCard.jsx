import React from 'react';
import { getRelativeTimeBn } from '../utils/dateUtils';

export default function NewsCard({ article }) {
  if (!article) return null;

  return (
    <article className="news-card">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="news-card-link"
      >
        {/* Media / Thumbnail */}
        {article.image ? (
          <div className="news-card-media">
            <img
              src={article.image}
              alt={article.title}
              className="news-card-img"
              loading="lazy"
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
          </div>
        ) : null}

        <div className="news-card-body">
          <div className="news-card-meta">
            <span
              className="source-badge-solid"
              style={{ backgroundColor: article.badgeColor || '#D91A2A' }}
            >
              {article.source}
            </span>
            <span className="cat-text-muted">{article.category}</span>
            <span className="time-text">{getRelativeTimeBn(article.publishedAt)}</span>
          </div>

          <h3 className="news-card-title">{article.title}</h3>

          {article.description && article.description !== article.title && (
            <p className="news-card-desc">{article.description}</p>
          )}

          <div className="news-card-footer">
            <span className="read-source-hint">
              মূল প্রতিবেদন পড়ুন ({article.source}) ↗
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
