export const CATEGORIES_LIST = [
  { id: 'all', name: 'সর্বশেষ', icon: '⚡' },
  { id: 'bangladesh', name: 'বাংলাদেশ', icon: '🇧🇩' },
  { id: 'politics', name: 'রাজনীতি', icon: '🏛️' },
  { id: 'world', name: 'আন্তর্জাতিক', icon: '🌐' },
  { id: 'business', name: 'ব্যবসা ও অর্থনীতি', icon: '📈' },
  { id: 'tech', name: 'বিজ্ঞান ও প্রযুক্তি', icon: '💻' },
  { id: 'sports', name: 'খেলাধুলা', icon: '⚽' },
  { id: 'entertainment', name: 'বিনোদন', icon: '🎬' },
  { id: 'lifestyle', name: 'জীবনযাপন ও স্বাস্থ্য', icon: '🌿' }
];

export const matchCategory = (articleCategory, selectedCategoryName) => {
  if (!selectedCategoryName || selectedCategoryName === 'সর্বশেষ' || selectedCategoryName === 'all') {
    return true;
  }
  if (!articleCategory) return false;
  return articleCategory.toLowerCase().includes(selectedCategoryName.toLowerCase()) ||
         selectedCategoryName.toLowerCase().includes(articleCategory.toLowerCase());
};
