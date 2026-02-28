import heroImage from "@/assets/hero-library.jpg";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Warm library interior with green plants and sunlit bookshelves"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-xl animate-fade-in-up">
          <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-widest text-leaf-foreground/80">
            Welcome to Greenleaf
          </p>
          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-primary-foreground md:text-6xl">
            Discover Your Next Great Read
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">
            Browse our curated collection and borrow books for up to 30 days.
            A natural reading experience, rooted in community.
          </p>
          <Button
            size="lg"
            className="gap-2 bg-leaf text-leaf-foreground hover:bg-leaf/90"
            onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
          >
            <BookOpen className="h-5 w-5" />
            Browse Catalog
          </Button>
        </div>
      </div>
    </section>
  );
}
