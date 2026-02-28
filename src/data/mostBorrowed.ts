export interface MostBorrowedBook {
  bookId: string;
  title: string;
  author: string;
  borrowCount: number;
}

/**
 * Replace this with your actual data source.
 * This function returns the most borrowed books sorted by borrow count.
 * You can link your real data here — just return an array of MostBorrowedBook.
 */
export function getMostBorrowedBooks(): MostBorrowedBook[] {
  // TODO: Link your actual borrowing data here.
  // Example placeholder data:
  return [
    { bookId: "1", title: "The Secret Garden", author: "Frances Hodgson Burnett", borrowCount: 42 },
    { bookId: "5", title: "A Brief History of Time", author: "Stephen Hawking", borrowCount: 38 },
    { bookId: "4", title: "The Lord of the Rings", author: "J.R.R. Tolkien", borrowCount: 35 },
    { bookId: "6", title: "Sapiens", author: "Yuval Noah Harari", borrowCount: 29 },
    { bookId: "7", title: "Pride and Prejudice", author: "Jane Austen", borrowCount: 24 },
  ];
}
