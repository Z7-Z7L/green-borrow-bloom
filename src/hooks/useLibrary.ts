import { useState, useCallback } from "react";
import { Book, Booking } from "@/data/books";
import { books as initialBooks } from "@/data/books";
import { format } from "date-fns";

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const borrowBook = useCallback(
    (bookId: string, name: string, email: string, startDate: Date, endDate: Date) => {
      const booking: Booking = {
        id: crypto.randomUUID(),
        bookId,
        borrowerName: name,
        borrowerEmail: email,
        startDate,
        endDate,
      };
      setBookings((prev) => [...prev, booking]);
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, available: false } : b))
      );

      // Send notification (fire and forget)
      const book = initialBooks.find((b) => b.id === bookId);
      if (book) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (supabaseUrl && supabaseKey) {
          fetch(`${supabaseUrl}/functions/v1/notify-borrow`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              bookTitle: `${book.title.en} / ${book.title.ar}`,
              borrowerName: name,
              borrowerEmail: email,
              startDate: format(startDate, "yyyy-MM-dd"),
              endDate: format(endDate, "yyyy-MM-dd"),
            }),
          }).catch((err) => console.error("Notification failed:", err));
        }
      }

      return booking;
    },
    []
  );

  const returnBook = useCallback(
    (bookId: string) => {
      setBookings((prev) => prev.filter((b) => b.bookId !== bookId));
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, available: true } : b))
      );
    },
    []
  );

  return { books, bookings, borrowBook, returnBook };
}
