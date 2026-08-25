import React from 'react';
import { CATEGORIES_LIST } from '../utils/categoryUtils';

export default function CategoryNav({ activeCategory, onSelectCategory, counts }) {
  return (
    <nav className="category-nav-bar" aria-label="News Categories">
      <div className="site-container">
        <div className="category-tabs-scroll">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = activeCategory === cat.name;
            const count = counts?.[cat.name];

            return (
              <button
                key={cat.id}
                className={`category-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.name)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
                {count !== undefined && (
                  <span className="cat-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
