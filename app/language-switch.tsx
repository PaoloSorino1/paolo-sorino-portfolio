"use client";

import { useLanguage, type Language } from "./language-context";

const languages: Array<{ code: Language; label: string }> = [
  { code: "en", label: "EN" },
  { code: "it", label: "IT" },
];

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      aria-label={
        language === "it" ? "Seleziona la lingua" : "Choose language"
      }
      className="language-switch"
      role="group"
    >
      {languages.map((item) => (
        <button
          aria-label={
            item.code === "it"
              ? language === "it"
                ? "Italiano selezionato"
                : "Switch to Italian"
              : language === "en"
                ? "English selected"
                : "Passa all’inglese"
          }
          aria-pressed={language === item.code}
          className={language === item.code ? "is-active" : undefined}
          key={item.code}
          onClick={() => setLanguage(item.code)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
