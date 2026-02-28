import { Leaf } from "lucide-react";
import { useLang } from "@/hooks/useLang";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer id="about" className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-leaf" />
            <span className="font-serif text-lg font-semibold">{t.brand}</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{t.footerDesc}</p>
          <p className="text-xs text-muted-foreground">{t.allRights}</p>
        </div>
      </div>
    </footer>
  );
}
