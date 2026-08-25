// Bengali number converter
export const toBengaliDigits = (num) => {
  const bnNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => bnNumbers[+w]);
};

// Bengali Months
const BENGALI_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const BENGALI_DAYS = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// Returns friendly Bengali relative time (e.g. "৫ মিনিট আগে", "১ ঘণ্টা আগে", "গতকাল")
export const getRelativeTimeBn = (dateString) => {
  if (!dateString) return 'কিছুক্ষণ আগে';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'কিছুক্ষণ আগে';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'এইমাত্র';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${toBengaliDigits(diffInMinutes)} মিনিট আগে`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${toBengaliDigits(diffInHours)} ঘণ্টা আগে`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'গতকাল';
  }

  if (diffInDays < 7) {
    return `${toBengaliDigits(diffInDays)} দিন আগে`;
  }

  // Format as "১২ আগস্ট, ২০২৬"
  const day = toBengaliDigits(date.getDate());
  const month = BENGALI_MONTHS[date.getMonth()];
  const year = toBengaliDigits(date.getFullYear());
  return `${day} ${month}, ${year}`;
};

// Formats full current date in Dhaka timezone (e.g. "বুধবার, ২৬ আগস্ট ২০২৬")
export const getDhakaCurrentDateBn = () => {
  const now = new Date();
  const dayName = BENGALI_DAYS[now.getDay()];
  const day = toBengaliDigits(now.getDate());
  const month = BENGALI_MONTHS[now.getMonth()];
  const year = toBengaliDigits(now.getFullYear());
  return `${dayName}, ${day} ${month} ${year}`;
};
