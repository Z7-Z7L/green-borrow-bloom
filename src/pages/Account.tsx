import { format } from "date-fns";
import { Book } from "@/data/books";
import { BorrowingRecord } from "@/hooks/useLibrary";
import { Booking } from "@/data/books";
import { useLang } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, RotateCcw, Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface AccountPageProps {
  books: Book[];
  bookings: Booking[];
  history: BorrowingRecord[];
  onReturn: (bookId: string) => void;
  isOnHold: boolean;
  holdUntil: Date | null;
  lateCount: number;
}

export default function AccountPage({ books, bookings, history, onReturn, isOnHold, holdUntil, lateCount }: AccountPageProps) {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const activeBooks = bookings.map((booking) => {
    const book = books.find((b) => b.id === booking.bookId);
    return { booking, book };
  }).filter((item) => item.book);

  const returnedRecords = history
    .filter((h) => h.returned)
    .map((record) => {
      const book = books.find((b) => b.id === record.bookId);
      return { record, book };
    })
    .filter((item) => item.book);

  const now = new Date();

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

        {/* Hold warning */}
        {isOnHold && holdUntil && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <ShieldAlert className="h-6 w-6 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">{t.accountOnHold}</p>
              <p className="text-sm text-destructive/80">
                {t.holdUntilMsg} {format(holdUntil, "MMM d, yyyy h:mm a")}
              </p>
            </div>
          </div>
        )}

        {/* Late warnings count */}
        {lateCount > 0 && !isOnHold && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-orange-400/30 bg-orange-50 dark:bg-orange-950/20 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500" />
            <p className="text-sm text-orange-700 dark:text-orange-400">
              {t.lateWarning.replace("{count}", String(lateCount))}
            </p>
          </div>
        )}

        {/* Active Borrowings */}
        <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">{t.currentBorrowings}</h2>
        {activeBooks.length > 0 ? (
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeBooks.map(({ booking, book }) => {
              const isOverdue = now > booking.endDate;
              return (
                <div
                  key={booking.id}
                  className={`flex gap-4 rounded-lg border p-4 shadow-sm ${isOverdue ? "border-destructive/40 bg-destructive/5" : "bg-card"}`}
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
                      <p className={`text-xs ${isOverdue ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
                        {t.returnBy}: {format(booking.endDate, "MMM d, yyyy")}
                        {isOverdue && " ⚠️ OVERDUE"}
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
              );
            })}
          </div>
        ) : (
          <div className="mb-10 flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="font-serif text-lg font-semibold text-muted-foreground">
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

        {/* Borrowing History */}
        <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">{t.borrowingHistory}</h2>
        {returnedRecords.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {returnedRecords.map(({ record, book }) => (
              <div
                key={record.id}
                className="flex gap-4 rounded-lg border bg-card/50 p-4 opacity-80"
              >
                <img
                  src={book!.cover}
                  alt={book!.title[lang]}
                  className="h-28 w-18 rounded-md object-cover grayscale-[30%]"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-card-foreground">
                      {book!.title[lang]}
                    </h3>
                    <p className="text-sm text-muted-foreground">{book!.author[lang]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(record.startDate, "MMM d")} — {format(record.endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="mr-1 h-3 w-3" />
                      {t.returned}
                    </Badge>
                    {record.wasLate && (
                      <Badge variant="destructive" className="text-xs">
                        {t.lateReturn}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">{t.noHistory}</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
