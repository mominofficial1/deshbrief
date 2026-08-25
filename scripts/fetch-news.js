import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCES_FILE = path.join(ROOT_DIR, 'config', 'sources.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'data', 'news.json');

const CATEGORIES = [
  { id: 'bangladesh', name: 'বাংলাদেশ', keywords: ['বাংলাদেশ', 'ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ', 'জাতীয়', 'দেশ', 'bangladesh', 'national', 'dhaka'] },
  { id: 'politics', name: 'রাজনীতি', keywords: ['রাজনীতি', 'নির্বাচন', 'দল', 'আওয়ামী', 'বিএনপি', 'জামায়াত', 'উপদেষ্টা', 'সরকার', 'সংসদ', 'politics', 'election', 'parliament', 'government', 'bnp', 'al'] },
  { id: 'world', name: 'আন্তর্জাতিক', keywords: ['আন্তর্জাতিক', 'বিশ্ব', 'যুক্তরাষ্ট্র', 'ভারত', 'চীন', 'ইউক্রেন', 'রাশিয়া', 'ফিলিস্তিন', 'ইসরায়েল', 'জাতিসংঘ', 'world', 'international', 'global', 'usa', 'india', 'china', 'un'] },
  { id: 'business', name: 'ব্যবসা ও অর্থনীতি', keywords: ['ব্যবসা', 'বাণিজ্য', 'অর্থনীতি', 'টাকা', 'ডলার', 'ব্যাংক', 'শেয়ারবাজার', 'বাজেট', 'মুদ্রাস্ফীতি', 'business', 'economy', 'market', 'bank', 'trade', 'inflation', 'gdp'] },
  { id: 'tech', name: 'বিজ্ঞান ও প্রযুক্তি', keywords: ['প্রযুক্তি', 'বিজ্ঞান', 'স্মার্টফোন', 'এআই', 'ইন্টারনেট', 'কম্পিউটার', 'গুগল', 'মহাকাশ', 'নাসা', 'tech', 'technology', 'science', 'ai', 'mobile', 'internet', 'cyber', 'gadget'] },
  { id: 'sports', name: 'খেলাধুলা', keywords: ['খেলা', 'ক্রিকেট', 'ফুটবল', 'বিপিএল', 'আইপিএল', 'বিশ্বকাপ', 'মেসি', 'রোনালদো', 'সাকিব', 'sports', 'cricket', 'football', 'bpl', 'world cup', 'match', 'fifa', 'icc'] },
  { id: 'entertainment', name: 'বিনোদন', keywords: ['বিনোদন', 'সিনেমা', 'নাটক', 'গান', 'বলিউড', 'হলিউড', 'তারকা', 'অভিনেতা', 'অভিনেত্রী', 'entertainment', 'cinema', 'movie', 'showbiz', 'celebrity', 'music'] },
  { id: 'lifestyle', name: 'জীবনযাপন ও স্বাস্থ্য', keywords: ['জীবনযাপন', 'স্বাস্থ্য', 'লাইফস্টাইল', 'খাবার', 'ভ্রমণ', 'রূপচর্চা', 'চিকিৎসা', 'রোগ', 'lifestyle', 'health', 'fitness', 'travel', 'food', 'wellness', 'diet'] }
];

function stripHtml(html) {
  if (html === null || html === undefined) return '';
  const str = typeof html === 'object' ? JSON.stringify(html) : String(html);
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageFromHtml(html) {
  if (!html) return null;
  const str = typeof html === 'object' ? JSON.stringify(html) : String(html);
  const match = str.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1] && !match[1].includes('feedburner') && !match[1].endsWith('.gif')) {
    return match[1];
  }
  return null;
}

function determineCategory(title, description, rawCategories) {
  const fullText = `${title || ''} ${description || ''} ${(rawCategories || []).join(' ')}`.toLowerCase();

  // 1. Try raw category matching first
  if (rawCategories && rawCategories.length > 0) {
    for (const raw of rawCategories) {
      const rawLower = String(raw).toLowerCase();
      for (const cat of CATEGORIES) {
        if (cat.keywords.some(k => rawLower.includes(k.toLowerCase()))) {
          return cat.name;
        }
      }
    }
  }

  // 2. Keyword score matching
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (fullText.includes(kw.toLowerCase())) {
        return cat.name;
      }
    }
  }

  return 'বাংলাদেশ'; // Default category
}

function generateArticleId(url, title) {
  const hash = crypto.createHash('md5').update(url || title).digest('hex').substring(0, 12);
  return `art-${hash}`;
}

async function fetchFeed(source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(source.feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 DeshBriefBot/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    return parseXmlFeed(xmlText, source);
  } catch (error) {
    console.warn(`[WARN] Failed to fetch feed for "${source.name}":`, error.message);
    return [];
  }
}

function parseXmlFeed(xmlText, source) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    trimValues: true,
    cdataPropName: '__cdata'
  });

  const parsed = parser.parse(xmlText);
  const articles = [];

  // Case 1: RSS 2.0 (<rss><channel><item>)
  const channel = parsed?.rss?.channel || parsed?.channel;
  if (channel && channel.item) {
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    for (const item of items) {
      const title = stripHtml(item.title?.__cdata || item.title?.['#text'] || item.title);
      const url = item.link?.__cdata || item.link?.['#text'] || item.link || item.guid?.['#text'] || item.guid;
      if (!title || !url || typeof url !== 'string' || !url.startsWith('http')) continue;

      const rawDesc = item.description?.__cdata || item.description?.['#text'] || item.description || 
                      item['content:encoded']?.__cdata || item['content:encoded']?.['#text'] || item['content:encoded'];
      const description = stripHtml(rawDesc).substring(0, 240);

      let image = null;
      // 1. Enclosure
      if (item.enclosure && item.enclosure['@_url']) {
        image = item.enclosure['@_url'];
      }
      // 2. Media content / thumbnail
      if (!image && item['media:content'] && item['media:content']['@_url']) {
        image = item['media:content']['@_url'];
      }
      if (!image && item['media:thumbnail'] && item['media:thumbnail']['@_url']) {
        image = item['media:thumbnail']['@_url'];
      }
      // 3. Extract from HTML content
      if (!image) {
        image = extractImageFromHtml(rawDesc);
      }

      // Categories
      const rawCategories = [];
      if (item.category) {
        const cats = Array.isArray(item.category) ? item.category : [item.category];
        cats.forEach(c => {
          const text = c?.['#text'] || c;
          if (typeof text === 'string') rawCategories.push(text);
        });
      }

      let pubDate = new Date();
      if (item.pubDate) {
        const parsedDate = new Date(item.pubDate);
        if (!isNaN(parsedDate.getTime())) pubDate = parsedDate;
      }

      articles.push({
        id: generateArticleId(url, title),
        title,
        description: description || title,
        url: url.trim(),
        source: source.name,
        sourceEnglishName: source.englishName,
        sourceId: source.id,
        badgeColor: source.badgeColor,
        image: image || null,
        publishedAt: pubDate.toISOString(),
        category: determineCategory(title, description, rawCategories),
        language: source.language || 'bn',
        priority: source.priority || 5
      });
    }
  }

  // Case 2: Atom Feed (<feed><entry>)
  const feed = parsed?.feed;
  if (feed && feed.entry) {
    const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];

    for (const entry of entries) {
      const title = stripHtml(entry.title?.__cdata || entry.title?.['#text'] || entry.title);
      let url = null;
      if (typeof entry.link === 'string') url = entry.link;
      else if (entry.link?.['@_href']) url = entry.link['@_href'];
      else if (Array.isArray(entry.link)) {
        const alt = entry.link.find(l => l['@_rel'] === 'alternate') || entry.link[0];
        url = alt?.['@_href'];
      }
      if (!title || !url) continue;

      const rawDesc = entry.summary?.__cdata || entry.summary?.['#text'] || entry.summary ||
                      entry.content?.__cdata || entry.content?.['#text'] || entry.content;
      const description = stripHtml(rawDesc).substring(0, 240);

      let image = null;
      if (entry['media:content']?.['@_url']) image = entry['media:content']['@_url'];
      if (!image && entry['media:thumbnail']?.['@_url']) image = entry['media:thumbnail']['@_url'];
      if (!image) image = extractImageFromHtml(rawDesc);

      let pubDate = new Date();
      const dateStr = entry.published || entry.updated;
      if (dateStr) {
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) pubDate = parsedDate;
      }

      articles.push({
        id: generateArticleId(url, title),
        title,
        description: description || title,
        url: url.trim(),
        source: source.name,
        sourceEnglishName: source.englishName,
        sourceId: source.id,
        badgeColor: source.badgeColor,
        image: image || null,
        publishedAt: pubDate.toISOString(),
        category: determineCategory(title, description, []),
        language: source.language || 'bn',
        priority: source.priority || 5
      });
    }
  }

  return articles;
}

function deduplicateAndRank(articles) {
  const seenUrls = new Set();
  const seenTitles = new Set();
  const unique = [];

  for (const art of articles) {
    if (seenUrls.has(art.url)) continue;
    seenUrls.add(art.url);

    // Normalize title to catch duplicate headlines
    const cleanTitle = art.title.toLowerCase().replace(/[\s\-_–|—:]+/g, ' ').trim();
    if (seenTitles.has(cleanTitle)) continue;
    seenTitles.add(cleanTitle);

    unique.push(art);
  }

  // Sort by publication date (descending) with slight priority boost
  unique.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });

  return unique.slice(0, 250); // Store up to 250 latest stories
}

async function main() {
  console.log('🚀 [DeshBrief] Starting news aggregation...');

  if (!fs.existsSync(SOURCES_FILE)) {
    console.error(`[ERROR] Sources file not found at ${SOURCES_FILE}`);
    process.exit(1);
  }

  const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf-8'));
  const enabledSources = sources.filter(s => s.enabled);

  console.log(`📡 Fetching from ${enabledSources.length} enabled official news sources...`);

  const results = await Promise.allSettled(enabledSources.map(fetchFeed));
  const allArticles = [];

  results.forEach((res, i) => {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      console.log(`  ✓ ${enabledSources[i].name}: fetched ${res.value.length} stories`);
      allArticles.push(...res.value);
    } else {
      console.warn(`  ✗ ${enabledSources[i].name}: failed`);
    }
  });

  console.log(`📊 Total raw articles collected: ${allArticles.length}`);

  if (allArticles.length === 0) {
    if (fs.existsSync(OUTPUT_FILE)) {
      console.warn('⚠️ No new articles fetched. Retaining previous news.json to prevent empty state.');
      return;
    }
  }

  const finalArticles = deduplicateAndRank(allArticles);

  const payload = {
    metadata: {
      platform: 'DeshBrief',
      tagline: 'সব গুরুত্বপূর্ণ খবর, এক নজরে।',
      updatedAt: new Date().toISOString(),
      totalArticles: finalArticles.length,
      activeSources: enabledSources.map(s => ({
        id: s.id,
        name: s.name,
        websiteUrl: s.websiteUrl,
        badgeColor: s.badgeColor
      }))
    },
    articles: finalArticles
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');

  console.log(`✅ [DeshBrief] Successfully wrote ${finalArticles.length} clean articles to ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
