import { Leaf } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const teamMembers = {
  row1: [
    { en: "Mohammed Al-Jaber", ar: "محمد الجابر" },
    { en: "Osama Al-Barakat", ar: "اسامة البركات" },
  ],
  row2: [
    { en: "Abdulrahman Al-Khudair", ar: "عبدالرحمن الخضير" },
    { en: "Abdulaziz Al-Bashir", ar: "عبدالعزيز البشير" },
    { en: "Mohammed Al-Bandar", ar: "محمد البندر" },
  ],
};

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer id="about" className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-leaf" />
            <span className="font-serif text-lg font-semibold">{t.brand}</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{t.footerDesc}</p>

          {/* Team Section */}
          <div className="mt-4">
            <h3 className="mb-3 font-serif text-lg font-semibold text-foreground">{t.team}</h3>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-4">
                {teamMembers.row1.map((member) => (
                  <span key={member.en} className="rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-foreground">
                    {member[lang]}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {teamMembers.row2.map((member) => (
                  <span key={member.en} className="rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-foreground">
                    {member[lang]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{t.allRights}</p>
        </div>
      </div>
    </footer>
  );
}
