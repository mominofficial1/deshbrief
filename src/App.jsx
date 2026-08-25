import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import BreakingNews from './components/BreakingNews';
import CategoryNav from './components/CategoryNav';
import HeroNews from './components/HeroNews';
import SourceFilter from './components/SourceFilter';
import NewsGrid from './components/NewsGrid';
import SearchModal from './components/SearchModal';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';

import { matchCategory } from './utils/categoryUtils';
import { getTopStories } from './utils/rankUtils';

export default function App() {
  const [data, setData] = useState({ metadata: null, articles: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('সর্বশেষ');
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Dark mode initialized from localStorage or prefers-color-scheme
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('deshbrief-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('deshbrief-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('deshbrief-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch static news data
  useEffect(() => {
    setLoading(true);
    fetch('./data/news.json?t=' + Date.now())
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData({
          metadata: json.metadata || null,
          articles: json.articles || []
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load news.json:', err);
        setError('সংবাদ লোড করতে সাময়িক সমস্যা হচ্ছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
        setLoading(false);
      });
  }, []);

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts = { 'সর্বশেষ': data.articles.length };
    data.articles.forEach((art) => {
      if (art.category) {
        counts[art.category] = (counts[art.category] || 0) + 1;
      }
    });
    return counts;
  }, [data.articles]);

  // Source counts calculation
  const sourceCounts = useMemo(() => {
    const counts = {};
    data.articles.forEach((art) => {
      counts[art.source] = (counts[art.source] || 0) + 1;
    });
    return counts;
  }, [data.articles]);

  // Top stories for the hero section
  const topStories = useMemo(() => {
    return getTopStories(data.articles, 5);
  }, [data.articles]);

  // Filtered articles for the main grid
  const filteredArticles = useMemo(() => {
    return data.articles.filter((art) => {
      // 1. Category match
      const catMatch = matchCategory(art.category, activeCategory);
      if (!catMatch) return false;

      // 2. Source match
      if (selectedSourceId && art.sourceId !== selectedSourceId) {
        return false;
      }

      return true;
    });
  }, [data.articles, activeCategory, selectedSourceId]);

  const selectedSourceObj = data.metadata?.activeSources?.find((s) => s.id === selectedSourceId);

  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setActiveCategory('সর্বশেষ');
    setSelectedSourceId(null);
  };

  return (
    <div className="app-layout">
      {/* Sticky Header */}
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        totalArticles={data.articles.length}
        updatedAt={data.metadata?.updatedAt}
      />

      {/* Breaking News Ticker */}
      {!loading && data.articles.length > 0 && (
        <BreakingNews articles={data.articles} />
      )}

      {/* Horizontal Category Navigation */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        counts={categoryCounts}
      />

      <main className="site-main-content">
        {/* Editorial Top News Hero (Only shown when viewing 'সর্বশেষ' with no source filter) */}
        {!loading && activeCategory === 'সর্বশেষ' && !selectedSourceId && (
          <HeroNews topStories={topStories} />
        )}

        {/* Source Filter Pills */}
        {!loading && data.metadata?.activeSources && (
          <SourceFilter
            sources={data.metadata.activeSources}
            selectedSourceId={selectedSourceId}
            onSelectSource={setSelectedSourceId}
            sourceCounts={sourceCounts}
          />
        )}

        {/* Main Feed Grid */}
        <NewsGrid
          articles={filteredArticles}
          loading={loading}
          activeCategory={activeCategory}
          selectedSourceName={selectedSourceObj ? selectedSourceObj.name : null}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allArticles={data.articles}
      />

      {/* About & Disclaimer Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Site Footer */}
      <Footer
        sources={data.metadata?.activeSources || []}
        onSelectCategory={handleSelectCategory}
        onSelectSource={setSelectedSourceId}
        onOpenAbout={() => setIsAboutOpen(true)}
      />
    </div>
  );
}
