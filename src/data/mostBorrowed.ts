import { supabase } from "@/integrations/supabase/client";
import { books } from "./books";

export interface MostBorrowedBook {
  bookId: string;
  title: { en: string; ar: string };
  author: { en: string; ar: string };
  borrowCount: number;
}

/**
 * Fetches most borrowed books using a secure database function
 * that aggregates across all users.
 */
export async function getMostBorrowedBooks(): Promise<MostBorrowedBook[]> {
  const { data, error } = await supabase.rpc("get_most_borrowed_books", {
    limit_count: 5,
  });

  if (error || !data) {
    console.error("Failed to fetch most borrowed books:", error);
    return [];
  }

  return (data as { book_id: string; borrow_count: number }[]).map((row) => {
    const book = books.find((b) => b.id === row.book_id);
    return {
      bookId: row.book_id,
      title: book?.title || { en: "Unknown", ar: "غير معروف" },
      author: book?.author || { en: "Unknown", ar: "غير معروف" },
      borrowCount: row.borrow_count,
    };
  });
}
