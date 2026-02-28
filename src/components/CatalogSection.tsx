import { useState } from "react";
import { Book, genres } from "@/data/books";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BookCard from "./BookCard";
import { useLang } from "@/hooks/useLang";

interface CatalogSectionProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export default function CatalogSection({ books, onSelectBook }: CatalogSectionProps) {
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const { t, lang } = useLang();

  const filtered = books.filter((b) => {
    const matchesSearch =
      b.title[lang].toLowerCase().includes(search.toLowerCase()) ||
      b.author[lang].toLowerCase().includes(search.toLowerCase());
    const matchesGenre = activeGenre === "All" || b.genre.en === activeGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <section id="catalog" className="bg-cream py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-4xl font-bold text-foreground">{t.ourCollection}</h2>
          <p className="mt-2 text-muted-foreground">{t.ourCollectionDesc}</p>
        </div>

        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
            <Input
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rtl:pl-3 rtl:pr-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.en}
                onClick={() => setActiveGenre(genre.en)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeGenre === genre.en
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {genre[lang]}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} onSelect={onSelectBook} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">{t.noBooks}</p>
          </div>
        )}
      </div>
    </section>
  );
}
