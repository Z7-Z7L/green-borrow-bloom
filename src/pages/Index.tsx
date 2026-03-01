import { useState } from "react";
import { Book, Booking } from "@/data/books";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CatalogSection from "@/components/CatalogSection";
import BookDialog from "@/components/BookDialog";
import Footer from "@/components/Footer";

interface IndexProps {
  books: Book[];
  bookings: Booking[];
  borrowBook: (bookId: string, name: string, email: string, start: Date, end: Date) => void;
}

const Index = ({ books, bookings, borrowBook }: IndexProps) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CatalogSection books={books} onSelectBook={setSelectedBook} />
      <BookDialog
        book={selectedBook}
        open={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onBorrow={borrowBook}
        bookings={bookings}
        onSelectSuggested={setSelectedBook}
      />
      <Footer />
    </div>
  );
};

export default Index;
