import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer id="about" className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-leaf" />
            <span className="font-serif text-lg font-semibold">Greenleaf Library</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            A community library rooted in the love of reading and nature.
            Borrow books for free, up to 30 days at a time.
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Greenleaf Library. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
