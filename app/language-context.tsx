"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "it";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "paolo-portfolio-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let savedLanguage: Language | null = null;

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (storedValue === "en" || storedValue === "it") {
        savedLanguage = storedValue;
      }
    } catch {
      // The switch still works when browser storage is unavailable.
    }

    const hydrationTimer = window.setTimeout(() => {
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    if (isReady) {
      try {
        window.localStorage.setItem(STORAGE_KEY, language);
      } catch {
        // Keep the in-memory preference when browser storage is unavailable.
      }
    }
  }, [isReady, language]);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
