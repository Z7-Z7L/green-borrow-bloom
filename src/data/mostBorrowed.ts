import { books } from "./books";

export interface MostBorrowedBook {
  bookId: string;
  title: { en: string; ar: string };
  author: { en: string; ar: string };
  borrowCount: number;
}

/**
 * Returns the most borrowed books sorted by borrow count (descending).
 * Data comes from the borrowCount field on each book.
 */
export function getMostBorrowedBooks(): MostBorrowedBook[] {
  return books
    .filter((b) => b.borrowCount > 0)
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5)
    .map((b) => ({
      bookId: b.id,
      title: b.title,
      author: b.author,
      borrowCount: b.borrowCount,
    }));
}
