import heroImage from "@/assets/hero-library.jpg";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useLang } from "@/hooks/useLang";

export default function HeroSection() {
  const { t } = useLang();

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Warm library interior with green plants and sunlit bookshelves"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent rtl:bg-gradient-to-l" />
      </div>
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-xl animate-fade-in-up">
          <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-widest text-leaf-foreground/80">
            {t.heroWelcome}
          </p>
          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-primary-foreground md:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">
            {t.heroDesc}
          </p>
          <Button
            size="lg"
            className="gap-2 bg-leaf text-leaf-foreground hover:bg-leaf/90"
            onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
          >
            <BookOpen className="h-5 w-5" />
            {t.browseCatalog}
          </Button>
        </div>
      </div>
    </section>
  );
}
