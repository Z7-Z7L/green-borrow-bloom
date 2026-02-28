import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "en" | "ar";

const translations = {
  en: {
    brand: "Green Clover Library",
    catalog: "Catalog",
    about: "About",
    heroWelcome: "Welcome to Green Clover",
    heroTitle: "Discover Your Next Great Read",
    heroDesc: "Browse our curated collection and borrow books for up to 30 days. A natural reading experience, rooted in community.",
    browseCatalog: "Browse Catalog",
    ourCollection: "Our Collection",
    ourCollectionDesc: "Browse and borrow from our curated catalog",
    searchPlaceholder: "Search by title or author...",
    available: "Available",
    borrowed: "Borrowed",
    noBooks: "No books found matching your search.",
    borrowThis: "Borrow This Book",
    unavailable: "Currently Unavailable",
    fullName: "Full Name",
    email: "Email",
    startDate: "Start Date",
    returnDate: "Return Date",
    pickDate: "Pick date",
    borrowingFor: "Borrowing for",
    days: "days",
    day: "day",
    back: "Back",
    confirmBooking: "Confirm Booking",
    bookingConfirmed: "Booking Confirmed!",
    youBorrowed: "You've borrowed",
    returnBy: "Return by",
    done: "Done",
    fillDetails: "Fill in your details and pick a return date (max 30 days).",
    footerDesc: "A community library rooted in the love of reading and nature. Borrow books for free, up to 30 days at a time.",
    allRights: "© 2026 Green Clover Library. All rights reserved.",
    mostBorrowed: "Most Borrowed",
    mostBorrowedTitle: "Most Borrowed Books",
    mostBorrowedDesc: "See which books are trending in our community.",
    timesLabel: "times",
    noData: "No borrowing data available yet.",
    genre: "Genre",
    pages: "Pages",
    yourName: "Your name",
    team: "Our Team",
  },
  ar: {
    brand: "مكتبة البرسيم الأخضر",
    catalog: "الكتالوج",
    about: "حول",
    heroWelcome: "أهلاً بكم في البرسيم الأخضر",
    heroTitle: "اكتشف قراءتك القادمة",
    heroDesc: "تصفّح مجموعتنا المنتقاة واستعر الكتب لمدة تصل إلى 30 يوماً. تجربة قراءة طبيعية متجذرة في المجتمع.",
    browseCatalog: "تصفّح الكتالوج",
    ourCollection: "مجموعتنا",
    ourCollectionDesc: "تصفّح واستعر من كتالوجنا المنتقى",
    searchPlaceholder: "ابحث بالعنوان أو المؤلف...",
    available: "متاح",
    borrowed: "مُستعار",
    noBooks: "لم يتم العثور على كتب مطابقة لبحثك.",
    borrowThis: "استعر هذا الكتاب",
    unavailable: "غير متاح حالياً",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    startDate: "تاريخ البدء",
    returnDate: "تاريخ الإرجاع",
    pickDate: "اختر تاريخاً",
    borrowingFor: "مدة الاستعارة",
    days: "أيام",
    day: "يوم",
    back: "رجوع",
    confirmBooking: "تأكيد الحجز",
    bookingConfirmed: "تم تأكيد الحجز!",
    youBorrowed: "لقد استعرت",
    returnBy: "أرجع بحلول",
    done: "تم",
    fillDetails: "أدخل بياناتك واختر تاريخ الإرجاع (30 يوماً كحد أقصى).",
    footerDesc: "مكتبة مجتمعية متجذرة في حب القراءة والطبيعة. استعر الكتب مجاناً لمدة تصل إلى 30 يوماً.",
    allRights: "© 2026 مكتبة البرسيم الأخضر. جميع الحقوق محفوظة.",
    mostBorrowed: "الأكثر استعارة",
    mostBorrowedTitle: "الكتب الأكثر استعارة",
    mostBorrowedDesc: "شاهد الكتب الأكثر رواجاً في مجتمعنا.",
    timesLabel: "مرة",
    noData: "لا توجد بيانات استعارة حتى الآن.",
    genre: "النوع",
    pages: "الصفحات",
    yourName: "اسمك",
    team: "فريق العمل",
  },
} as const;

type Translations = Record<keyof typeof translations.en, string>;

interface LangContextType {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  }, []);

  const value: LangContextType = {
    lang,
    t: translations[lang],
    setLang,
    dir: lang === "ar" ? "rtl" : "ltr",
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
