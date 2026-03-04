import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LangProvider } from "@/hooks/useLang";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useLibrary } from "@/hooks/useLibrary";
import Index from "./pages/Index";
import AccountPage from "./pages/Account";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { books, bookings, history, borrowBook, returnBook, isOnHold, holdUntil, lateCount } = useLibrary();
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index books={books} bookings={bookings} borrowBook={borrowBook} />} />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage books={books} bookings={bookings} history={history} onReturn={returnBook} isOnHold={isOnHold} holdUntil={holdUntil} lateCount={lateCount} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LangProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/green-borrow-bloom">
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
