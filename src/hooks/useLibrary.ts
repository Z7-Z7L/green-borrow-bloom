import { useState, useCallback, useEffect } from "react";
import { Book, Booking } from "@/data/books";
import { books as initialBooks } from "@/data/books";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  // Load user's active borrowings from DB
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setBooks(initialBooks.map((b) => ({ ...b, available: true })));
      return;
    }

    const loadBorrowings = async () => {
      const { data, error } = await supabase
        .from("borrowings")
        .select("*")
        .eq("returned", false);

      if (error) {
        console.error("Failed to load borrowings:", error);
        return;
      }

      if (data) {
        const loadedBookings: Booking[] = data.map((b: any) => ({
          id: b.id,
          bookId: b.book_id,
          borrowerName: "",
          borrowerEmail: "",
          startDate: new Date(b.start_date),
          endDate: new Date(b.end_date),
        }));
        setBookings(loadedBookings);

        const borrowedIds = new Set(data.map((b: any) => b.book_id));
        setBooks(initialBooks.map((b) => ({
          ...b,
          available: !borrowedIds.has(b.id),
        })));
      }
    };

    loadBorrowings();
  }, [user]);

  const borrowBook = useCallback(
    async (bookId: string, startDate: Date, endDate: Date) => {
      if (!user) return null;

      // Insert into DB
      const { data, error } = await supabase
        .from("borrowings")
        .insert({
          user_id: user.id,
          book_id: bookId,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to borrow:", error);
        return null;
      }

      const booking: Booking = {
        id: data.id,
        bookId,
        borrowerName: user.user_metadata?.full_name || "",
        borrowerEmail: user.email || "",
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
              borrowerName: user.user_metadata?.full_name || "",
              borrowerEmail: user.email || "",
              startDate: format(startDate, "yyyy-MM-dd"),
              endDate: format(endDate, "yyyy-MM-dd"),
            }),
          }).catch((err) => console.error("Notification failed:", err));
        }
      }

      return booking;
    },
    [user]
  );

  const returnBook = useCallback(
    async (bookId: string) => {
      if (!user) return;

      const booking = bookings.find((b) => b.bookId === bookId);
      if (booking) {
        await supabase
          .from("borrowings")
          .update({ returned: true })
          .eq("id", booking.id);
      }

      setBookings((prev) => prev.filter((b) => b.bookId !== bookId));
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, available: true } : b))
      );
    },
    [user, bookings]
  );

  return { books, bookings, borrowBook, returnBook };
}
