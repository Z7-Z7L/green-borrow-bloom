import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/hooks/useLang";
import { useLibrary } from "@/hooks/useLibrary";
import Index from "./pages/Index";
import AccountPage from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { books, bookings, borrowBook, returnBook } = useLibrary();

  return (
    <Routes>
      <Route path="/" element={<Index books={books} bookings={bookings} borrowBook={borrowBook} />} />
      <Route path="/account" element={<AccountPage books={books} bookings={bookings} onReturn={returnBook} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LangProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/green-borrow-bloom">
          <AppRoutes />
        </BrowserRouter>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
