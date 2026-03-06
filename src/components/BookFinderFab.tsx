import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLang } from "@/hooks/useLang";
import { books, Book } from "@/data/books";
import { cn } from "@/lib/utils";

const questions = {
  en: [
    {
      question: "What mood are you in right now?",
      options: [
        { label: "Adventurous & curious", genres: ["Fiction", "Fantasy", "Mystery & Thriller"] },
        { label: "Reflective & thoughtful", genres: ["Philosophy", "Philosophy & Thought", "Poetry & Literature"] },
        { label: "Eager to learn something new", genres: ["Science", "Non-Fiction", "Science & Knowledge", "History & Biography"] },
        { label: "Looking for an emotional journey", genres: ["Romance & Drama", "Classic Literature"] },
      ],
    },
    {
      question: "How much time do you want to spend reading?",
      options: [
        { label: "A quick read (under 200 pages)", maxPages: 200 },
        { label: "A medium read (200–400 pages)", minPages: 200, maxPages: 400 },
        { label: "I want to get lost in a long book", minPages: 400 },
      ],
    },
    {
      question: "Do you prefer classic or modern writing?",
      options: [
        { label: "Classic — timeless masterpieces", maxYear: 1970 },
        { label: "Modern — contemporary voices", minYear: 1970 },
        { label: "I don't mind either", maxYear: 9999 },
      ],
    },
  ],
  ar: [
    {
      question: "ما مزاجك الآن؟",
      options: [
        { label: "مغامر وفضولي", genres: ["روايات", "خيال", "غموض وإثارة"] },
        { label: "تأملي وعميق", genres: ["فلسفة", "فلسفة وفكر", "شعر وأدب"] },
        { label: "متحمس لتعلم شيء جديد", genres: ["علوم", "غير خيالي", "علوم ومعرفة", "تاريخ وسيرة"] },
        { label: "أبحث عن رحلة عاطفية", genres: ["رومانسية ودراما", "أدب كلاسيكي"] },
      ],
    },
    {
      question: "كم من الوقت تريد قضاءه في القراءة؟",
      options: [
        { label: "قراءة سريعة (أقل من 200 صفحة)", maxPages: 200 },
        { label: "قراءة متوسطة (200–400 صفحة)", minPages: 200, maxPages: 400 },
        { label: "أريد الغوص في كتاب طويل", minPages: 400 },
      ],
    },
    {
      question: "هل تفضل الكتابة الكلاسيكية أم الحديثة؟",
      options: [
        { label: "كلاسيكية — روائع خالدة", maxYear: 1970 },
        { label: "حديثة — أصوات معاصرة", minYear: 1970 },
        { label: "لا يهمني", maxYear: 9999 },
      ],
    },
  ],
};

const aiPhrases = {
  en: [
    "Analyzing your reading preferences...",
    "Searching through our collection...",
    "Matching books to your taste...",
    "Almost there, curating your picks...",
  ],
  ar: [
    "جارٍ تحليل تفضيلاتك القرائية...",
    "البحث في مجموعتنا...",
    "مطابقة الكتب مع ذوقك...",
    "اقتربنا، نختار لك الأفضل...",
  ],
};

interface BookFinderFabProps {
  onSelectBook: (book: Book) => void;
}

export default function BookFinderFab({ onSelectBook }: BookFinderFabProps) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [results, setResults] = useState<Book[] | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const qs = questions[lang];
  const phrases = aiPhrases[lang];

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setLoading(false);
    setLoadingText("");
    setResults(null);
    setCurrentAnswer("");
  };

  const handleOpen = () => {
    reset();
    setOpen(true);
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (step < qs.length - 1) {
      setStep(step + 1);
    } else {
      runFakeAI(newAnswers);
    }
  };

  const runFakeAI = (allAnswers: string[]) => {
    setLoading(true);
    let i = 0;
    setLoadingText(phrases[0]);

    const interval = setInterval(() => {
      i++;
      if (i < phrases.length) {
        setLoadingText(phrases[i]);
      } else {
        clearInterval(interval);
        const matched = findBooks(allAnswers);
        setResults(matched);
        setLoading(false);
      }
    }, 800);
  };

  const findBooks = (allAnswers: string[]): Book[] => {
    const q1Option = qs[0].options[parseInt(allAnswers[0])];
    const q2Option = qs[1].options[parseInt(allAnswers[1])];
    const q3Option = qs[2].options[parseInt(allAnswers[2])];

    const preferredGenres: string[] = (q1Option as any).genres || [];
    const minPages = (q2Option as any).minPages || 0;
    const maxPages = (q2Option as any).maxPages || 99999;
    const minYear = (q3Option as any).minYear || 0;
    const maxYear = (q3Option as any).maxYear || 9999;

    const scored = books
      .filter((b) => b.available)
      .map((b) => {
        let score = 0;
        const bookGenre = lang === "ar" ? b.genre.ar : b.genre.en;
        if (preferredGenres.includes(bookGenre)) score += 10;
        if (b.pages >= minPages && b.pages <= maxPages) score += 5;
        if (b.year >= minYear && b.year <= maxYear) score += 3;
        score += Math.random() * 2; // slight randomness
        return { book: b, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return scored.map((s) => s.book);
  };

  const labelTitle = lang === "ar" ? "اكتشف كتابك القادم" : "Find Your Next Read";
  const labelNext = lang === "ar" ? "التالي" : "Next";
  const labelStartOver = lang === "ar" ? "ابدأ من جديد" : "Start Over";
  const labelPerfectFor = lang === "ar" ? "مثالي لك!" : "Perfect for you!";
  const labelBorrow = lang === "ar" ? "عرض الكتاب" : "View Book";

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-label={labelTitle}
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {labelTitle}
            </DialogTitle>
            <DialogDescription>
              {lang === "ar"
                ? "أجب على بعض الأسئلة وسنجد لك الكتاب المثالي"
                : "Answer a few questions and we'll find the perfect book for you"}
            </DialogDescription>
          </DialogHeader>

          {/* Questions */}
          {!loading && !results && (
            <div className="space-y-4">
              <div className="flex gap-1.5">
                {qs.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      i <= step ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>

              <p className="font-medium text-foreground">{qs[step].question}</p>

              <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer} className="space-y-2">
                {qs[step].options.map((opt, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 transition-colors cursor-pointer",
                      currentAnswer === String(i)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    )}
                    onClick={() => setCurrentAnswer(String(i))}
                  >
                    <RadioGroupItem value={String(i)} id={`q${step}-o${i}`} />
                    <Label htmlFor={`q${step}-o${i}`} className="flex-1 cursor-pointer text-sm">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button onClick={handleNext} disabled={!currentAnswer} className="w-full">
                {step < qs.length - 1 ? labelNext : (lang === "ar" ? "اكتشف" : "Discover")}
              </Button>
            </div>
          )}

          {/* Loading / AI simulation */}
          {loading && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-muted border-t-primary" />
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                {loadingText}
              </p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-4">
              <p className="text-center text-sm font-semibold text-primary">{labelPerfectFor}</p>
              <div className="space-y-3">
                {results.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <img
                      src={book.cover}
                      alt={book.title[lang]}
                      className="h-16 w-11 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {book.title[lang]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {book.author[lang]}
                      </p>
                      <p className="text-xs text-muted-foreground">{book.genre[lang]}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        reset();
                        onSelectBook(book);
                      }}
                    >
                      {labelBorrow}
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" onClick={reset} className="w-full text-muted-foreground">
                {labelStartOver}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
