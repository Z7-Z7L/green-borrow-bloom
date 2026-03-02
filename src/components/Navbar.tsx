import { Leaf, Globe, User, LogOut } from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/hooks/useAuth";
import MostBorrowedDialog from "./MostBorrowedDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          <Leaf className="h-6 w-6 text-leaf" />
          <span className="font-serif text-xl font-semibold text-foreground">
            {t.brand}
          </span>
        </a>
        <div className="flex items-center gap-3 text-sm font-medium">
          <a href="#catalog" className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline">
            {t.catalog}
          </a>
          <a href="#about" className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline">
            {t.about}
          </a>
          <MostBorrowedDialog />
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/account")}
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => { await signOut(); navigate("/"); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
              {t.signIn}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Globe className="h-4 w-4" />
                {lang === "en" ? "EN" : "AR"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLang("en")} className={lang === "en" ? "font-semibold" : ""}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("ar")} className={lang === "ar" ? "font-semibold" : ""}>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
