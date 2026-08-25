// Calculates top headline score considering recency, image presence, and publisher weight
export const getTopStories = (articles, count = 5) => {
  if (!articles || articles.length === 0) return [];

  // Filter articles with images preferred for hero
  const withImages = articles.filter(a => !!a.image);
  const pool = withImages.length >= count ? withImages : articles;

  // Score stories
  const scored = pool.map(item => {
    let score = (item.priority || 5) * 10;
    if (item.image) score += 25;

    // Recency boost (within 4 hours)
    const hoursOld = (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60);
    if (hoursOld < 4) score += (4 - hoursOld) * 10;

    return { ...item, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, count);
};
