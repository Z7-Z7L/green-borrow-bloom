import { supabase } from "@/integrations/supabase/client";
import { books } from "./books";

export interface MostBorrowedBook {
  bookId: string;
  title: { en: string; ar: string };
  author: { en: string; ar: string };
  borrowCount: number;
}

/**
 * Fetches most borrowed books from the database by counting borrowings per book_id.
 */
export async function getMostBorrowedBooks(): Promise<MostBorrowedBook[]> {
  const { data, error } = await supabase
    .from("borrowings")
    .select("book_id");

  if (error || !data) {
    console.error("Failed to fetch borrow counts:", error);
    return [];
  }

  // Count borrowings per book
  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.book_id] = (counts[row.book_id] || 0) + 1;
  }

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([bookId, count]) => {
      const book = books.find((b) => b.id === bookId);
      return {
        bookId,
        title: book?.title || { en: "Unknown", ar: "غير معروف" },
        author: book?.author || { en: "Unknown", ar: "غير معروف" },
        borrowCount: count,
      };
    });
}
