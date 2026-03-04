import { useState, useCallback, useEffect } from "react";
import { Book, Booking } from "@/data/books";
import { books as initialBooks } from "@/data/books";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface BorrowingRecord {
  id: string;
  bookId: string;
  startDate: Date;
  endDate: Date;
  returned: boolean;
  wasLate: boolean;
}

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [history, setHistory] = useState<BorrowingRecord[]>([]);
  const [holdUntil, setHoldUntil] = useState<Date | null>(null);
  const [lateCount, setLateCount] = useState(0);
  const { user } = useAuth();

  // Load user's borrowings + profile from DB
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setHistory([]);
      setBooks(initialBooks.map((b) => ({ ...b, available: true })));
      setHoldUntil(null);
      setLateCount(0);
      return;
    }

    const loadData = async () => {
      // Load all borrowings (active + returned)
      const { data: borrowData, error } = await supabase
        .from("borrowings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load borrowings:", error);
        return;
      }

      if (borrowData) {
        const active: Booking[] = [];
        const all: BorrowingRecord[] = [];

        for (const b of borrowData) {
          const endDate = new Date(b.end_date);
          const wasLate = b.returned && new Date(b.end_date) < new Date(b.created_at) ? false : false;

          all.push({
            id: b.id,
            bookId: b.book_id,
            startDate: new Date(b.start_date),
            endDate,
            returned: b.returned,
            wasLate: b.returned && endDate < new Date(), // approximate
          });

          if (!b.returned) {
            active.push({
              id: b.id,
              bookId: b.book_id,
              borrowerName: "",
              borrowerEmail: "",
              startDate: new Date(b.start_date),
              endDate,
            });
          }
        }

        setBookings(active);
        setHistory(all);

        // Mark books unavailable based on ALL active borrowings (not just this user)
        const { data: allActive } = await supabase
          .from("borrowings")
          .select("book_id")
          .eq("returned", false);

        const borrowedIds = new Set((allActive || []).map((b: any) => b.book_id));
        setBooks(initialBooks.map((b) => ({
          ...b,
          available: !borrowedIds.has(b.id),
        })));
      }

      // Load profile for hold info
      const { data: profile } = await supabase
        .from("profiles")
        .select("late_count, hold_until")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setLateCount(profile.late_count || 0);
        setHoldUntil(profile.hold_until ? new Date(profile.hold_until) : null);
      }
    };

    loadData();
  }, [user]);

  const isOnHold = holdUntil ? new Date() < holdUntil : false;

  const borrowBook = useCallback(
    async (bookId: string, startDate: Date, endDate: Date) => {
      if (!user) return null;

      if (isOnHold) {
        toast.error(`Your account is on hold until ${format(holdUntil!, "MMM d, yyyy h:mm a")}. You cannot borrow books.`);
        return null;
      }

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
      setHistory((prev) => [{
        id: data.id, bookId, startDate, endDate, returned: false, wasLate: false,
      }, ...prev]);
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, available: false } : b))
      );

      // Send notification
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
    [user, isOnHold, holdUntil]
  );

  const returnBook = useCallback(
    async (bookId: string) => {
      if (!user) return;

      const booking = bookings.find((b) => b.bookId === bookId);
      if (!booking) return;

      const isLate = new Date() > booking.endDate;

      // Update borrowing as returned
      await supabase
        .from("borrowings")
        .update({ returned: true })
        .eq("id", booking.id);

      if (isLate) {
        const newLateCount = lateCount + 1;
        const updateData: any = { late_count: newLateCount };

        if (newLateCount > 1) {
          // Apply 1-day hold
          const holdDate = new Date();
          holdDate.setDate(holdDate.getDate() + 1);
          updateData.hold_until = holdDate.toISOString();
          setHoldUntil(holdDate);
          toast.error(`⚠️ This is your ${newLateCount}${newLateCount === 2 ? 'nd' : newLateCount === 3 ? 'rd' : 'th'} late return. Your account is on hold for 1 day.`);
        } else {
          toast.warning("⚠️ Warning: This book was returned late. Repeated late returns will result in account holds.");
        }

        setLateCount(newLateCount);
        await supabase
          .from("profiles")
          .update(updateData)
          .eq("user_id", user.id);
      }

      setBookings((prev) => prev.filter((b) => b.bookId !== bookId));
      setHistory((prev) => prev.map((h) =>
        h.id === booking.id ? { ...h, returned: true, wasLate: isLate } : h
      ));
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, available: true } : b))
      );
    },
    [user, bookings, lateCount]
  );

  return { books, bookings, history, borrowBook, returnBook, isOnHold, holdUntil, lateCount };
}
