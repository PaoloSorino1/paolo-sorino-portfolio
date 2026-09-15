import type { Language } from "./language-context";
import { initialPortfolio, localize } from "./portfolio-content";

export function translate(language: Language, text: string) {
  const copy = initialPortfolio.copy as Record<string, { en: string; it: string }>;
  return copy[text] ? localize(copy[text], language) : text;
}
