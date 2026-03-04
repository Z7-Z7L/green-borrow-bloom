import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getMostBorrowedBooks, MostBorrowedBook } from "@/data/mostBorrowed";
import { useLang } from "@/hooks/useLang";

export default function MostBorrowedDialog() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<MostBorrowedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLang();

  useEffect(() => {
    if (open) {
      setLoading(true);
      getMostBorrowedBooks().then((result) => {
        setData(result);
        setLoading(false);
      });
    }
  }, [open]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-leaf/30 text-leaf hover:bg-leaf/10"
        onClick={() => setOpen(true)}
      >
        <TrendingUp className="h-4 w-4" />
        {t.mostBorrowed}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-border bg-background">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{t.mostBorrowedTitle}</DialogTitle>
            <DialogDescription>{t.mostBorrowedDesc}</DialogDescription>
          </DialogHeader>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading...</p>
          ) : data.length > 0 ? (
            <ol className="space-y-3">
              {data.map((item, i) => (
                <li
                  key={item.bookId}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf text-sm font-bold text-leaf-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-serif font-semibold text-card-foreground">
                      {item.title[lang]}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.author[lang]}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-muted-foreground">
                    {item.borrowCount} {t.timesLabel}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-8 text-center text-muted-foreground">{t.noData}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
