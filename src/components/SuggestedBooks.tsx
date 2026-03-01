import { Book, Booking } from "@/data/books";
import { books as allBooks } from "@/data/books";
import { useLang } from "@/hooks/useLang";

interface SuggestedBooksProps {
  currentBook: Book;
  bookings: Booking[];
  onSelectBook: (book: Book) => void;
}

export function getSuggestedBooks(currentBook: Book, bookings: Booking[]): Book[] {
  const borrowedIds = new Set(bookings.map((b) => b.bookId));
  const borrowedGenres = bookings
    .map((b) => allBooks.find((book) => book.id === b.bookId)?.genre.en)
    .filter(Boolean) as string[];

  const candidates = allBooks.filter(
    (b) => b.id !== currentBook.id && b.available
  );

  // Score: same genre as current book = 3, same genre as previously borrowed = 1, high borrow count = 0.5
  const scored = candidates.map((book) => {
    let score = 0;
    if (book.genre.en === currentBook.genre.en) score += 3;
    if (borrowedGenres.includes(book.genre.en)) score += 1;
    if (book.borrowCount > 10) score += 0.5;
    // Same author bonus
    if (book.author.en === currentBook.author.en) score += 2;
    return { book, score };
  });

  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);

  return scored.slice(0, 5).map((s) => s.book);
}

export default function SuggestedBooks({ currentBook, bookings, onSelectBook }: SuggestedBooksProps) {
  const { t, lang } = useLang();
  const suggestions = getSuggestedBooks(currentBook, bookings);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="mb-3 font-serif text-sm font-semibold text-foreground">{t.suggestedBooks}</h4>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {suggestions.map((book) => (
          <button
            key={book.id}
            onClick={() => onSelectBook(book)}
            className="flex shrink-0 flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted"
            style={{ width: 80 }}
          >
            <img
              src={book.cover}
              alt={book.title[lang]}
              className="h-24 w-16 rounded object-cover shadow-sm"
            />
            <span className="line-clamp-2 text-center text-xs font-medium text-card-foreground">
              {book.title[lang]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
