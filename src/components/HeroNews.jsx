import React from 'react';
import { getRelativeTimeBn } from '../utils/dateUtils';

export default function HeroNews({ topStories }) {
  if (!topStories || topStories.length === 0) return null;

  const leadStory = topStories[0];
  const sideStories = topStories.slice(1, 5);

  return (
    <section className="hero-news-section">
      <div className="site-container">
        <div className="section-title-row">
          <div className="section-headline-group">
            <span className="accent-bar"></span>
            <h2 className="section-heading">প্রধান খবর</h2>
            <span className="section-subtitle">সর্বশেষ আলোচিত ও শীর্ষ সংবাদ</span>
          </div>
        </div>

        <div className="hero-editorial-grid">
          {/* Main Lead Story */}
          {leadStory && (
            <article className="hero-lead-card">
              <a
                href={leadStory.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-lead-link"
              >
                <div className="hero-lead-media">
                  {leadStory.image ? (
                    <img
                      src={leadStory.image}
                      alt={leadStory.title}
                      className="hero-lead-img"
                      loading="eager"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="hero-lead-placeholder">
                      <span>DeshBrief Top Story</span>
                    </div>
                  )}
                  <span
                    className="source-badge-floating"
                    style={{ backgroundColor: leadStory.badgeColor || '#D91A2A' }}
                  >
                    {leadStory.source}
                  </span>
                </div>

                <div className="hero-lead-content">
                  <div className="card-meta">
                    <span className="cat-pill">{leadStory.category}</span>
                    <span className="meta-time">{getRelativeTimeBn(leadStory.publishedAt)}</span>
                  </div>

                  <h3 className="hero-lead-title">{leadStory.title}</h3>
                  <p className="hero-lead-desc">{leadStory.description}</p>

                  <div className="read-original-cta">
                    <span>মূল প্রতিবেদন পড়ুন</span>
                    <span className="arrow-icon">↗</span>
                  </div>
                </div>
              </a>
            </article>
          )}

          {/* Secondary Headlines Column */}
          <div className="hero-side-column">
            {sideStories.map((story, idx) => (
              <article className="hero-side-card" key={story.id || idx}>
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-side-link"
                >
                  <div className="hero-side-body">
                    <div className="card-meta">
                      <span
                        className="source-badge-inline"
                        style={{ color: story.badgeColor || '#D91A2A', borderColor: story.badgeColor || '#D91A2A' }}
                      >
                        {story.source}
                      </span>
                      <span className="meta-time">{getRelativeTimeBn(story.publishedAt)}</span>
                    </div>
                    <h4 className="hero-side-title">{story.title}</h4>
                  </div>

                  {story.image && (
                    <div className="hero-side-thumb">
                      <img
                        src={story.image}
                        alt={story.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.parentElement.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
