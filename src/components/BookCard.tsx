import { Book } from "@/data/books";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/hooks/useLang";

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
}

export default function BookCard({ book, onSelect }: BookCardProps) {
  const { t } = useLang();

  return (
    <button
      onClick={() => onSelect(book)}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring rtl:text-right"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <Badge
          className={`absolute right-2 top-2 ${
            book.available
              ? "bg-leaf text-leaf-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {book.available ? t.available : t.borrowed}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {book.genre}
        </p>
        <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-card-foreground">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
      </div>
    </button>
  );
}
