import { Leaf } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-leaf" />
          <span className="font-serif text-xl font-semibold text-foreground">
            Greenleaf Library
          </span>
        </a>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#catalog" className="text-muted-foreground transition-colors hover:text-foreground">
            Catalog
          </a>
          <a href="#about" className="text-muted-foreground transition-colors hover:text-foreground">
            About
          </a>
        </div>
      </div>
    </nav>
  );
}
