export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Book {
  id: string;
  title: LocalizedString;
  author: LocalizedString;
  genre: LocalizedString;
  cover: string;
  description: LocalizedString;
  available: boolean;
  isbn: string;
  pages: number;
  year: number;
  borrowCount: number;
}

export interface Booking {
  id: string;
  bookId: string;
  borrowerName: string;
  borrowerEmail: string;
  startDate: Date;
  endDate: Date;
}

export const genres = [
  { en: "All", ar: "الكل" },
  { en: "Fiction", ar: "روايات" },
  { en: "Non-Fiction", ar: "غير خيالي" },
  { en: "Science", ar: "علوم" },
  { en: "Fantasy", ar: "خيال" },
  { en: "History", ar: "تاريخ" },
  { en: "Philosophy", ar: "فلسفة" },
  { en: "Poetry & Literature", ar: "شعر وأدب" },
] as const;

export const books: Book[] = [
  {
    id: "1",
    title: { en: "The Secret Garden", ar: "الحديقة السرية" },
    author: { en: "Frances Hodgson Burnett", ar: "فرانسيس هودجسون بيرنت" },
    genre: { en: "Fiction", ar: "روايات" },
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    description: {
      en: "A classic tale of a young girl who discovers a hidden garden and transforms both it and herself through the healing power of nature.",
      ar: "قصة كلاسيكية عن فتاة صغيرة تكتشف حديقة مخفية وتحوّلها وتحوّل نفسها من خلال قوة الطبيعة الشافية.",
    },
    available: true,
    isbn: "978-0-14-043-765-8",
    pages: 331,
    year: 1911,
    borrowCount: 42,
  },
  {
    id: "2",
    title: { en: "Walden", ar: "والدن" },
    author: { en: "Henry David Thoreau", ar: "هنري ديفيد ثورو" },
    genre: { en: "Philosophy", ar: "فلسفة" },
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    description: {
      en: "A reflection upon simple living in natural surroundings, inspired by the author's two years spent in a cabin near Walden Pond.",
      ar: "تأمل في العيش البسيط في الطبيعة، مستوحى من عامين قضاهما المؤلف في كوخ بالقرب من بركة والدن.",
    },
    available: true,
    isbn: "978-0-14-039-044-0",
    pages: 352,
    year: 1854,
    borrowCount: 18,
  },
  {
    id: "3",
    title: { en: "The Origin of Species", ar: "أصل الأنواع" },
    author: { en: "Charles Darwin", ar: "تشارلز داروين" },
    genre: { en: "Science", ar: "علوم" },
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    description: {
      en: "Darwin's groundbreaking work introducing the scientific theory of evolution by natural selection.",
      ar: "عمل داروين الرائد الذي قدّم النظرية العلمية للتطور عن طريق الانتقاء الطبيعي.",
    },
    available: true,
    isbn: "978-0-451-52906-5",
    pages: 502,
    year: 1859,
    borrowCount: 25,
  },
  {
    id: "4",
    title: { en: "The Lord of the Rings", ar: "سيد الخواتم" },
    author: { en: "J.R.R. Tolkien", ar: "ج.ر.ر. تولكين" },
    genre: { en: "Fantasy", ar: "خيال" },
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop",
    description: {
      en: "An epic high-fantasy novel set in Middle-earth, following the quest to destroy the One Ring.",
      ar: "رواية ملحمية خيالية تدور أحداثها في الأرض الوسطى، تتبع رحلة تدمير الخاتم الواحد.",
    },
    available: true,
    isbn: "978-0-618-64015-7",
    pages: 1178,
    year: 1954,
    borrowCount: 35,
  },
  {
    id: "5",
    title: { en: "A Brief History of Time", ar: "تاريخ موجز للزمن" },
    author: { en: "Stephen Hawking", ar: "ستيفن هوكينغ" },
    genre: { en: "Science", ar: "علوم" },
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    description: {
      en: "A landmark exploration of the universe, from the Big Bang to black holes, written for the general reader.",
      ar: "استكشاف بارز للكون، من الانفجار العظيم إلى الثقوب السوداء، مكتوب للقارئ العام.",
    },
    available: true,
    isbn: "978-0-553-38016-3",
    pages: 256,
    year: 1988,
    borrowCount: 38,
  },
  {
    id: "6",
    title: { en: "Sapiens", ar: "العاقل" },
    author: { en: "Yuval Noah Harari", ar: "يوفال نوح هراري" },
    genre: { en: "History", ar: "تاريخ" },
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    description: {
      en: "A sweeping narrative of humankind's creation and evolution, exploring how biology and history have defined us.",
      ar: "سرد شامل لخلق البشرية وتطورها، يستكشف كيف حددنا علم الأحياء والتاريخ.",
    },
    available: true,
    isbn: "978-0-06-231609-7",
    pages: 443,
    year: 2011,
    borrowCount: 29,
  },
  {
    id: "7",
    title: { en: "Pride and Prejudice", ar: "كبرياء وتحامل" },
    author: { en: "Jane Austen", ar: "جين أوستن" },
    genre: { en: "Fiction", ar: "روايات" },
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop",
    description: {
      en: "A witty and romantic novel about the Bennet family and the proud Mr. Darcy in Regency-era England.",
      ar: "رواية ذكية ورومانسية عن عائلة بينيت والسيد داري المتكبر في إنجلترا عصر الوصاية.",
    },
    available: true,
    isbn: "978-0-14-143-951-8",
    pages: 432,
    year: 1813,
    borrowCount: 24,
  },
  {
    id: "8",
    title: { en: "The Hobbit", ar: "الهوبيت" },
    author: { en: "J.R.R. Tolkien", ar: "ج.ر.ر. تولكين" },
    genre: { en: "Fantasy", ar: "خيال" },
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
    description: {
      en: "The adventure of Bilbo Baggins, a hobbit who embarks on an unexpected journey with dwarves and a wizard.",
      ar: "مغامرة بيلبو باغينز، هوبيت ينطلق في رحلة غير متوقعة مع الأقزام وساحر.",
    },
    available: true,
    isbn: "978-0-547-92822-7",
    pages: 310,
    year: 1937,
    borrowCount: 20,
  },
  {
    id: "9",
    title: { en: "I Will Not Live in My Father's Robe", ar: "لن أعيش في جلباب أبي" },
    author: { en: "Ihsan Abdel Quddous", ar: "إحسان عبد القدوس" },
    genre: { en: "Poetry & Literature", ar: "شعر وأدب" },
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    description: {
      en: "A bold social novel about the rebellion of a young generation against traditional values in 1950s Egypt, raising questions of freedom, identity, and the conflict between generations.",
      ar: "رواية اجتماعية جريئة تتناول تمرد الجيل الشاب على القيم التقليدية في مصر الخمسينيات، وتطرح قضايا الحرية والهوية والصراع بين الأجيال.",
    },
    available: true,
    isbn: "978-9770700525",
    pages: 280,
    year: 1962,
    borrowCount: 0,
  },
];
