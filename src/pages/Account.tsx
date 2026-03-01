import { format } from "date-fns";
import { Booking, Book } from "@/data/books";
import { useLang } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccountPageProps {
  books: Book[];
  bookings: Booking[];
  onReturn: (bookId: string) => void;
}

export default function AccountPage({ books, bookings, onReturn }: AccountPageProps) {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const borrowedBooks = bookings.map((booking) => {
    const book = books.find((b) => b.id === booking.bookId);
    return { booking, book };
  }).filter((item) => item.book);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">{t.myAccount}</h1>
            <p className="text-muted-foreground">{t.borrowedBooksDesc}</p>
          </div>
        </div>

        {borrowedBooks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {borrowedBooks.map(({ booking, book }) => (
              <div
                key={booking.id}
                className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm"
              >
                <img
                  src={book!.cover}
                  alt={book!.title[lang]}
                  className="h-32 w-20 rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-card-foreground">
                      {book!.title[lang]}
                    </h3>
                    <p className="text-sm text-muted-foreground">{book!.author[lang]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.borrowedOn}: {format(booking.startDate, "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.returnBy}: {format(booking.endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 gap-1.5 self-start border-leaf/30 text-leaf hover:bg-leaf/10"
                    onClick={() => onReturn(booking.bookId)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t.returnBook}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="font-serif text-xl font-semibold text-muted-foreground">
              {t.noBorrowedBooks}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.startBrowsing}</p>
            <Button
              className="mt-4 gap-2 bg-leaf text-leaf-foreground hover:bg-leaf/90"
              onClick={() => navigate("/")}
            >
              {t.browseCatalog}
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
