import { useState } from "react";
import { Book } from "@/data/books";
import { useLibrary } from "@/hooks/useLibrary";
import { LangProvider } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CatalogSection from "@/components/CatalogSection";
import BookDialog from "@/components/BookDialog";
import Footer from "@/components/Footer";

const Index = () => {
  const { books, borrowBook } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <LangProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <CatalogSection books={books} onSelectBook={setSelectedBook} />
        <BookDialog
          book={selectedBook}
          open={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          onBorrow={borrowBook}
        />
        <Footer />
      </div>
    </LangProvider>
  );
};

export default Index;
