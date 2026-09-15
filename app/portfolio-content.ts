import portfolioContent from "../content/portfolio.json";
import type { Language } from "./language-context";

export type LocalizedText = { en: string; it: string };
type Metric = { value: string; label: LocalizedText };
type ResearchItem = { number: string; title: LocalizedText; description: LocalizedText };
type ProfileLink = { label: string; href: string; icon: string; inPublications: boolean };
type Project = { year: LocalizedText; name: LocalizedText; role: LocalizedText; description: LocalizedText; accent: LocalizedText };
type Course = { period: LocalizedText; role: LocalizedText; course: LocalizedText; context: LocalizedText };
type ServiceItem = { label: LocalizedText; title: LocalizedText; description: LocalizedText; highlight: boolean };
type Talk = { year: string; event: LocalizedText; title: LocalizedText; context: LocalizedText; href: string };

/** Explicit types preserve the schema even when the editor empties an entire list. */
export type PortfolioContent = {
  profile: {
    name: string; givenName: string; familyName: string; suffix: string; initials: string;
    role: LocalizedText; email: string; affiliation: LocalizedText; affiliationUrl: string;
    department: LocalizedText; laboratory: string; institutionalUrl: string;
    portrait: string; portraitAlt: LocalizedText; links: ProfileLink[];
    expertise: { label: LocalizedText }[]; copyrightYear: string;
  };
  hero: { title: LocalizedText; titleAccent: LocalizedText; statement: LocalizedText; primaryAction: LocalizedText; secondaryAction: LocalizedText; topics: { label: LocalizedText }[] };
  about: { kicker: LocalizedText; title: LocalizedText; titleAccent: LocalizedText; paragraphs: { text: LocalizedText }[]; linkLabel: LocalizedText };
  research: { kicker: LocalizedText; title: LocalizedText; description: LocalizedText; items: ResearchItem[]; secondaryLabel: LocalizedText; secondaryDescription: LocalizedText };
  projects: { kicker: LocalizedText; title: LocalizedText; description: LocalizedText; note: LocalizedText; items: Project[] };
  teaching: { kicker: LocalizedText; title: LocalizedText; titleAccent: LocalizedText; description: LocalizedText; items: Course[]; stats: Metric[] };
  service: { kicker: LocalizedText; title: LocalizedText; items: ServiceItem[] };
  talks: { kicker: LocalizedText; description: LocalizedText; items: Talk[] };
  contact: { kicker: LocalizedText; title: LocalizedText; titleSecondLine: LocalizedText; titleAccent: LocalizedText; description: LocalizedText; cvLabel: LocalizedText; footerAffiliation: LocalizedText };
  metrics: { label: LocalizedText; publicationsLabel: LocalizedText; items: Metric[] };
  publicationsPage: { selectedKicker: LocalizedText; selectedTitle: LocalizedText; completeListLabel: LocalizedText; kicker: LocalizedText; title: LocalizedText; titleAccent: LocalizedText; description: LocalizedText; footer: LocalizedText };
  seo: { siteUrl: string; siteName: LocalizedText; title: LocalizedText; description: LocalizedText; personDescription: LocalizedText; socialImage: string; socialImageAlt: LocalizedText; publicationsTitle: LocalizedText; publicationsDescription: LocalizedText; keywords: { value: string }[]; googleVerification: string };
  copy: Record<string, LocalizedText>;
};
export const initialPortfolio: PortfolioContent = portfolioContent;

export function localize(value: LocalizedText, language: Language): string {
  return value[language] || value.en || value.it || "";
}

/** Local files respect GitHub Pages' repository base path; HTTPS URLs stay intact. */
export function publicAsset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** Stable templates also let the editor add items after an array has been emptied. */
const blankText = (): LocalizedText => ({ en: "", it: "" });
export const portfolioArrayTemplates: Record<string, JsonValue> = {
  "profile.links": { label: "", href: "", icon: "", inPublications: false },
  "profile.expertise": { label: blankText() },
  "hero.topics": { label: blankText() },
  "about.paragraphs": { text: blankText() },
  "research.items": { number: "", title: blankText(), description: blankText() },
  "projects.items": { year: blankText(), name: blankText(), role: blankText(), description: blankText(), accent: blankText() },
  "teaching.items": { period: blankText(), role: blankText(), course: blankText(), context: blankText() },
  "teaching.stats": { value: "", label: blankText() },
  "service.items": { label: blankText(), title: blankText(), description: blankText(), highlight: false },
  "talks.items": { year: "", event: blankText(), title: blankText(), context: blankText(), href: "" },
  "metrics.items": { value: "", label: blankText() },
  "seo.keywords": { value: "" },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isSafeUrl(value: string, allowLocal: boolean): boolean {
  if (!value) return true; // Optional links, artwork and social profiles may be empty.
  if (/[\u0000-\u0020\\]/.test(value)) return false;
  if (allowLocal && value.startsWith("/") && !value.startsWith("//")) {
    return !value.split(/[/?#]/).some((part) => part === "." || part === "..");
  }
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}

/** Reject malformed saved data before it can break a static production build. */
export function validatePortfolio(value: unknown): string[] {
  const errors: string[] = [];
  const check = (candidate: unknown, reference: JsonValue, path: string): void => {
    if (errors.length >= 30) return;
    if (Array.isArray(reference)) {
      if (!Array.isArray(candidate)) { errors.push(`${path}: deve essere un elenco.`); return; }
      if (candidate.length > 100) errors.push(`${path}: massimo 100 elementi.`);
      const template = portfolioArrayTemplates[path] ?? reference[0];
      candidate.slice(0, 101).forEach((item, index) => check(item, template, `${path}[${index}]`));
      return;
    }
    if (reference && typeof reference === "object") {
      if (!isRecord(candidate)) { errors.push(`${path}: struttura non valida.`); return; }
      for (const [key, child] of Object.entries(reference)) check(candidate[key], child, path ? `${path}.${key}` : key);
      for (const key of Object.keys(candidate)) {
        if (!Object.hasOwn(reference, key)) errors.push(`${path ? `${path}.` : ""}${key}: campo non riconosciuto.`);
      }
      return;
    }
    if (typeof candidate !== typeof reference) { errors.push(`${path}: tipo di valore non valido.`); return; }
    if (typeof candidate !== "string") return;
    if (candidate.length > 16000) errors.push(`${path}: testo troppo lungo (massimo 16.000 caratteri).`);
    if (/<\s*\/?\s*[a-z][^>]*>/i.test(candidate)) errors.push(`${path}: inserisci testo semplice, senza tag HTML.`);
    const field = path.split(".").pop() ?? "";
    if (/^(href|icon|portrait|socialImage)$/.test(field) && !isSafeUrl(candidate, true)) errors.push(`${path}: usa un URL http(s) o un percorso locale /... valido.`);
    if (/url$/i.test(field) && !isSafeUrl(candidate, false)) errors.push(`${path}: usa un URL http(s) completo e valido.`);
  };
  check(value, initialPortfolio, "");
  if (!isRecord(value)) return errors;
  if (isRecord(value.profile)) {
    if (typeof value.profile.name === "string" && !value.profile.name.trim()) errors.push("profile.name: il nome è obbligatorio.");
    if (typeof value.profile.email === "string" && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.profile.email)) errors.push("profile.email: inserisci un indirizzo e-mail valido.");
  }
  if (isRecord(value.seo)) {
    if (typeof value.seo.siteUrl !== "string" || !value.seo.siteUrl.trim()) {
      errors.push("seo.siteUrl: l’indirizzo pubblico del sito è obbligatorio.");
    } else if (/[?#]/.test(value.seo.siteUrl)) {
      errors.push("seo.siteUrl: usa l’indirizzo base del sito, senza parametri (?) o frammenti (#), per canonical e sitemap corretti.");
    }
  }
  if (isRecord(value.hero) && Array.isArray(value.hero.topics) && value.hero.topics.length > 5) errors.push("hero.topics: il ritratto supporta al massimo cinque topic, per evitare sovrapposizioni.");
  return errors;
}
