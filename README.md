# DeshBrief (দেশব্রিফ) — Bangladesh News Aggregation Platform

**DeshBrief** is a modern, responsive, 100% static news aggregation portal for Bangladesh. It automatically collects, filters, and ranks the latest headlines from official publisher RSS/Atom feeds into a high-performance React frontend hosted entirely on **GitHub Pages**.

> **"সব গুরুত্বপূর্ণ খবর, এক নজরে।"**  
> *"Bangladesh's important news, in one brief."*

---

## 🌟 Key Features

1. **Official RSS/Atom Aggregation**:
   - Fetches live headlines from verified Bangladeshi news publishers (Prothom Alo, The Daily Star, Dhaka Tribune, Jago News 24, Dhaka Post, RisingBD, and more).
   - Zero article scraping: Only displays headlines, official excerpts, publication timestamps, and direct publisher links.

2. **100% Static-Data Architecture**:
   - **No traditional database** (no MySQL, MongoDB, Firebase, or Supabase).
   - Driven by `scripts/fetch-news.js` producing `public/data/news.json`.
   - Updated continuously every 30 minutes via **GitHub Actions** cron.

3. **Editorial User Experience**:
   - **Hero Top News Grid**: 1 prominent lead story with 16:9 media wrap + 4 secondary headlines.
   - **Breaking News Ticker**: Animated headline bar with live bullet indicator.
   - **Smart Category Navigation**: সব, বাংলাদেশ, রাজনীতি, আন্তর্জাতিক, ব্যবসা ও অর্থনীতি, বিজ্ঞান ও প্রযুক্তি, খেলাধুলা, বিনোদন, জীবনযাপন ও স্বাস্থ্য.
   - **Publisher Source Filter**: Instant filtering by newsroom with real-time article counts and brand color tags.
   - **Live Search Modal**: Press `Ctrl + K` or `⌘K` to search by title, excerpt, category, or publisher.
   - **Dark Mode & Light Mode**: Instant theme switching with `localStorage` persistence.
   - **Relative Bengali Timestamps**: *"এইমাত্র"*, *"৫ মিনিট আগে"*, *"১ ঘণ্টা আগে"*, *"গতকাল"*.
   - **Legal Compliance**: Direct publisher attribution with `target="_blank" rel="noopener noreferrer"` and disclaimer modal.

---

## 📁 Repository Structure

```text
deshbrief/
│
├── .github/
│   └── workflows/
│       └── update-news.yml       # Scheduled GitHub Actions cron to update news.json & deploy
│
├── config/
│   └── sources.json              # Configurable list of official publisher feeds
│
├── scripts/
│   └── fetch-news.js             # Robust RSS parser, normalizer, and news.json builder
│
├── public/
│   ├── data/
│   │   └── news.json             # Static aggregated headlines dataset
│   ├── deshbrief-logo.png        # Official DeshBrief logo
│   ├── favicon.svg               # Brand vector favicon
│   ├── robots.txt                # Search engine crawler config
│   └── sitemap.xml               # Static sitemap
│
├── src/
│   ├── components/
│   │   ├── Header.jsx            # Sticky header, logo, live Dhaka clock, search & theme toggle
│   │   ├── BreakingNews.jsx      # Breaking news ticker bar
│   │   ├── CategoryNav.jsx       # Category tabs with live article counts
│   │   ├── HeroNews.jsx          # Lead story + top 4 secondary stories
│   │   ├── SourceFilter.jsx      # Publisher source selector pills
│   │   ├── NewsCard.jsx          # Editorial article card with source badge & relative time
│   │   ├── NewsGrid.jsx          # Multi-column grid with pagination & empty states
│   │   ├── SearchModal.jsx       # Live keyword search overlay (Ctrl+K)
│   │   ├── SkeletonCard.jsx      # Shimmer placeholder skeleton loader
│   │   ├── AboutModal.jsx        # Mission, legal disclaimer & methodology modal
│   │   └── Footer.jsx            # Legal attribution, publisher directory & copyright
│   │
│   ├── utils/
│   │   ├── dateUtils.js          # Bengali digits and relative time formatting
│   │   ├── categoryUtils.js      # Category mapping and keywords
│   │   └── rankUtils.js          # Recency & diversity ranking algorithm
│   │
│   ├── App.jsx                   # Main application state and layout
│   ├── main.jsx                  # React DOM root entry
│   └── index.css                 # Clean CSS tokens, dark mode, typography & responsive layouts
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Fetch Latest News Data
```bash
npm run fetch-news
```
*(This parses all enabled RSS feeds and writes `public/data/news.json`)*.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 📡 Adding or Modifying News Sources

All publishers are configured in `config/sources.json`:

```json
{
  "id": "prothom-alo-bn",
  "name": "প্রথম আলো",
  "englishName": "Prothom Alo",
  "language": "bn",
  "feedUrl": "https://www.prothomalo.com/feed/",
  "websiteUrl": "https://www.prothomalo.com",
  "priority": 10,
  "badgeColor": "#D91A2A",
  "enabled": true
}
```

- To enable/disable a feed, toggle `"enabled": true/false`.
- To adjust editorial weight, set `"priority": 1-10`.
- To update feed URLs, simply modify `"feedUrl"`.

---

## ⚙️ Automated GitHub Actions Workflow

When pushed to GitHub:
1. The `.github/workflows/update-news.yml` workflow triggers automatically on a 30-minute cron schedule.
2. It executes `scripts/fetch-news.js` to fetch latest news from all enabled publishers.
3. If new stories are found, it commits `public/data/news.json` and publishes the updated static build to **GitHub Pages**.

---

## ⚖️ Content Disclaimer
*DeshBrief is an independent news aggregation platform. All headlines, excerpts, and images belong to their respective publishers. Clicking any story directs the user to the original publisher's website.*
