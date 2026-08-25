import React from 'react';

export default function SourceFilter({ sources, selectedSourceId, onSelectSource, sourceCounts }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="source-filter-bar">
      <div className="site-container">
        <div className="source-filter-inner">
          <span className="source-filter-label">সংবাদমাধ্যম:</span>
          <div className="source-pills-scroll">
            <button
              className={`source-pill-btn ${!selectedSourceId ? 'active' : ''}`}
              onClick={() => onSelectSource(null)}
            >
              সকল সংবাদমাধ্যম
            </button>

            {sources.map((src) => {
              const isActive = selectedSourceId === src.id;
              const count = sourceCounts?.[src.name] || 0;

              return (
                <button
                  key={src.id}
                  className={`source-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectSource(src.id)}
                  style={isActive ? { borderColor: src.badgeColor, backgroundColor: src.badgeColor, color: '#FFFFFF' } : {}}
                >
                  <span className="source-dot" style={{ backgroundColor: src.badgeColor || '#D91A2A' }}></span>
                  <span>{src.name}</span>
                  {count > 0 && <span className="source-pill-count">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
