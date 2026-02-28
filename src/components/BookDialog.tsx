import { useState } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { Book } from "@/data/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, BookOpen, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLang } from "@/hooks/useLang";

interface BookDialogProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
  onBorrow: (bookId: string, name: string, email: string, start: Date, end: Date) => void;
}

export default function BookDialog({ book, open, onClose, onBorrow }: BookDialogProps) {
  const [step, setStep] = useState<"details" | "form" | "success">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 14));
  const { t, lang } = useLang();

  const maxEnd = startDate ? addDays(startDate, 30) : addDays(new Date(), 30);
  const duration = startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  const resetForm = () => {
    setStep("details");
    setName("");
    setEmail("");
    setStartDate(new Date());
    setEndDate(addDays(new Date(), 14));
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !startDate || !endDate || !name.trim() || !email.trim()) return;
    if (duration < 1 || duration > 30) {
      toast.error("Duration must be between 1 and 30 days.");
      return;
    }
    onBorrow(book.id, name, email, startDate, endDate);
    setStep("success");
    toast.success(`"${book.title[lang]}" has been reserved for you!`);
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg border-border bg-background">
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">{book.title[lang]}</DialogTitle>
              <DialogDescription>
                {book.author[lang]} · {book.year}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4">
              <img src={book.cover} alt={book.title[lang]} className="h-48 w-32 rounded-md object-cover shadow-md" />
              <div className="flex-1 space-y-2 text-sm">
                <p className="text-foreground">{book.description[lang]}</p>
                <div className="mt-3 space-y-1 text-muted-foreground">
                  <p>{t.genre}: <span className="text-foreground">{book.genre[lang]}</span></p>
                  <p>{t.pages}: <span className="text-foreground">{book.pages}</span></p>
                  <p>ISBN: <span className="text-foreground">{book.isbn}</span></p>
                </div>
              </div>
            </div>
            <Button
              className="mt-4 w-full gap-2 bg-leaf text-leaf-foreground hover:bg-leaf/90"
              disabled={!book.available}
              onClick={() => setStep("form")}
            >
              <BookOpen className="h-4 w-4" />
              {book.available ? t.borrowThis : t.unavailable}
            </Button>
          </>
        )}

        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {t.borrowThis} — "{book.title[lang]}"
              </DialogTitle>
              <DialogDescription>{t.fillDetails}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.fullName}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.yourName} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.startDate}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM d, yyyy") : t.pickDate}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single" selected={startDate}
                        onSelect={(d) => { setStartDate(d); if (d && endDate && differenceInDays(endDate, d) > 30) setEndDate(addDays(d, 30)); }}
                        disabled={(d) => d < new Date(new Date().toDateString())}
                        initialFocus className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>{t.returnDate}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM d, yyyy") : t.pickDate}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single" selected={endDate} onSelect={setEndDate}
                        disabled={(d) => !startDate || d <= startDate || d > maxEnd}
                        initialFocus className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {duration > 0 && (
                <p className="text-sm text-muted-foreground">
                  {t.borrowingFor} <span className="font-semibold text-foreground">{duration} {duration > 1 ? t.days : t.day}</span>
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("details")}>{t.back}</Button>
                <Button type="submit" className="flex-1 bg-leaf text-leaf-foreground hover:bg-leaf/90">{t.confirmBooking}</Button>
              </div>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="mb-4 h-16 w-16 text-leaf" />
            <h3 className="font-serif text-2xl font-semibold">{t.bookingConfirmed}</h3>
            <p className="mt-2 text-muted-foreground">
              {t.youBorrowed} <span className="font-medium text-foreground">"{book.title[lang]}"</span> — {duration} {duration > 1 ? t.days : t.day}.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.returnBy} {endDate ? format(endDate, "MMMM d, yyyy") : "—"}
            </p>
            <Button className="mt-6 bg-leaf text-leaf-foreground hover:bg-leaf/90" onClick={handleClose}>{t.done}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
