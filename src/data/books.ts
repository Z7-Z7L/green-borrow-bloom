export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  cover: string;
  description: string;
  available: boolean;
  isbn: string;
  pages: number;
  year: number;
}

export interface Booking {
  id: string;
  bookId: string;
  borrowerName: string;
  borrowerEmail: string;
  startDate: Date;
  endDate: Date;
}

export const genres = ["All", "Fiction", "Non-Fiction", "Science", "Fantasy", "History", "Philosophy"] as const;

export const books: Book[] = [
  {
    id: "1",
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    genre: "Fiction",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    description: "A classic tale of a young girl who discovers a hidden garden and transforms both it and herself through the healing power of nature.",
    available: true,
    isbn: "978-0-14-043-765-8",
    pages: 331,
    year: 1911,
  },
  {
    id: "2",
    title: "Walden",
    author: "Henry David Thoreau",
    genre: "Philosophy",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    description: "A reflection upon simple living in natural surroundings, inspired by the author's two years spent in a cabin near Walden Pond.",
    available: true,
    isbn: "978-0-14-039-044-0",
    pages: 352,
    year: 1854,
  },
  {
    id: "3",
    title: "The Origin of Species",
    author: "Charles Darwin",
    genre: "Science",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    description: "Darwin's groundbreaking work introducing the scientific theory of evolution by natural selection.",
    available: true,
    isbn: "978-0-451-52906-5",
    pages: 502,
    year: 1859,
  },
  {
    id: "4",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop",
    description: "An epic high-fantasy novel set in Middle-earth, following the quest to destroy the One Ring.",
    available: true,
    isbn: "978-0-618-64015-7",
    pages: 1178,
    year: 1954,
  },
  {
    id: "5",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    description: "A landmark exploration of the universe, from the Big Bang to black holes, written for the general reader.",
    available: true,
    isbn: "978-0-553-38016-3",
    pages: 256,
    year: 1988,
  },
  {
    id: "6",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "History",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    description: "A sweeping narrative of humankind's creation and evolution, exploring how biology and history have defined us.",
    available: true,
    isbn: "978-0-06-231609-7",
    pages: 443,
    year: 2011,
  },
  {
    id: "7",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Fiction",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop",
    description: "A witty and romantic novel about the Bennet family and the proud Mr. Darcy in Regency-era England.",
    available: true,
    isbn: "978-0-14-143-951-8",
    pages: 432,
    year: 1813,
  },
  {
    id: "8",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
    description: "The adventure of Bilbo Baggins, a hobbit who embarks on an unexpected journey with dwarves and a wizard.",
    available: true,
    isbn: "978-0-547-92822-7",
    pages: 310,
    year: 1937,
  },
];
