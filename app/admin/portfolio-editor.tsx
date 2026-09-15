"use client";

import { useState } from "react";
import {
  portfolioArrayTemplates,
  type PortfolioContent,
} from "../portfolio-content";
import styles from "./admin.module.css";

export const contentSections = [
  { id: "profile", label: "Identità e profili", note: "Nome, affiliazione, e-mail, ritratto e profili accademici. Ruolo e competenze alimentano anche i dati strutturati del profilo, in inglese." },
  { id: "hero", label: "Prima schermata", note: "Titolo del ruolo, presentazione principale e fino a cinque temi del visual scientifico." },
  { id: "about", label: "Biografia", note: "La tua presentazione e il testo della sezione Profilo." },
  { id: "research", label: "Ambiti di ricerca", note: "Aree principali, descrizioni e linee di ricerca complementari." },
  { id: "projects", label: "Progetti", note: "Aggiungi e riordina i progetti, con ruolo, periodo e descrizione." },
  { id: "teaching", label: "Didattica", note: "Corsi, incarichi di docenza, supervisione e formazione." },
  { id: "service", label: "Incarichi e brevetti", note: "Attività editoriali, responsabilità accademiche e innovazione." },
  { id: "talks", label: "Talk e conferenze", note: "Interventi su invito, eventi, date e collegamenti." },
  { id: "metrics", label: "Numeri del profilo", note: "Indicatori accademici. Il numero delle pubblicazioni resta automatico." },
  { id: "contact", label: "Contatti e footer", note: "Invito alle collaborazioni, testi dei contatti e piè di pagina." },
  { id: "publicationsPage", label: "Testi pubblicazioni", note: "Titoli e testi introduttivi della bibliografia e della selezione in homepage." },
  { id: "seo", label: "Ricerca e condivisione", note: "I metadata indicizzati e le anteprime social usano la versione inglese: lo switch EN/IT cambia i testi della pagina, non i metadata. Mantieni invariati indirizzo del sito e verifica Google, salvo necessità." },
  { id: "copy", label: "Menu e pulsanti", note: "Etichette dell’interfaccia in inglese e italiano." },
] as const;

export type ContentSectionId = (typeof contentSections)[number]["id"];

type Value = string | number | boolean | null | Value[] | { [key: string]: Value };
type Path = (string | number)[];

const fieldLabels: Record<string, string> = {
  name: "Nome", fullName: "Nome completo", displayName: "Nome visualizzato",
  givenName: "Nome", familyName: "Cognome", initials: "Monogramma", honorificSuffix: "Titolo accademico", suffix: "Titolo accademico",
  role: "Ruolo", jobTitle: "Ruolo professionale", affiliation: "Affiliazione",
  affiliationName: "Nome istituzione", affiliationUrl: "Sito istituzione",
  email: "E-mail", institution: "Istituzione", institutionUrl: "Sito istituzione",
  institutionalUrl: "Profilo istituzionale", institutionalLabel: "Etichetta profilo istituzionale",
  department: "Dipartimento", laboratory: "Laboratorio", expertise: "Competenze per il profilo strutturato", location: "Sede", links: "Profili e collegamenti",
  label: "Etichetta", href: "Collegamento (facoltativo)", icon: "Percorso icona",
  inPublications: "Mostra anche nella pagina Pubblicazioni", image: "Immagine",
  portrait: "Percorso o URL del ritratto", portraitSrc: "Percorso o URL del ritratto", portraitAlt: "Descrizione accessibile del ritratto",
  imageUrl: "URL immagine", imageAlt: "Descrizione accessibile immagine",
  kicker: "Sopratitolo", title: "Titolo", titleStart: "Titolo · prima parte",
  titleAccent: "Titolo · parte in evidenza", titleEnd: "Titolo · seconda parte",
  roleLine1: "Ruolo · prima riga", roleLine2: "Ruolo · seconda riga",
  headline: "Titolo principale", statement: "Presentazione breve", identity: "Nome e qualifica",
  description: "Descrizione", intro: "Introduzione", note: "Nota", context: "Contesto e dettagli",
  topics: "Temi nel visual", paragraphs: "Paragrafi", text: "Testo", items: "Voci",
  number: "Numero o icona", year: "Anno / periodo", period: "Periodo", accent: "Tema / etichetta",
  course: "Corso", event: "Evento", highlight: "Metti in evidenza questa voce",
  stats: "Indicatori", value: "Valore visualizzato", publicationsLabel: "Etichetta conteggio pubblicazioni",
  secondaryTitle: "Titolo linee complementari", secondaryLabel: "Etichetta linee complementari",
  secondaryDescription: "Linee complementari", secondaryText: "Linee complementari",
  copyrightYear: "Anno copyright", copyright: "Copyright", footer: "Piè di pagina",
  footerName: "Nome nel footer", footerAffiliation: "Affiliazione nel footer",
  primaryAction: "Pulsante principale", secondaryAction: "Pulsante secondario",
  titleLine1: "Titolo · prima riga", titleLine2: "Titolo · seconda riga",
  selectedTitle: "Titolo pubblicazioni selezionate", selectedKicker: "Sopratitolo pubblicazioni selezionate",
  selectedDescription: "Introduzione pubblicazioni selezionate", downloadLabel: "Pulsante download CV",
  siteName: "Nome del sito", siteTitle: "Titolo del sito", homeTitle: "Titolo homepage",
  siteDescription: "Descrizione del sito", homeDescription: "Descrizione homepage",
  socialTitle: "Titolo social", socialDescription: "Descrizione social", socialImage: "Immagine social",
  publicationsTitle: "Titolo SEO pubblicazioni", publicationsDescription: "Descrizione SEO pubblicazioni",
  profileDescription: "Descrizione profilo strutturato", knowsAbout: "Tematiche del profilo",
  linkLabel: "Testo collegamento al profilo", titleSecondLine: "Titolo · seconda riga", cvLabel: "Testo pulsante CV",
  completeListLabel: "Testo collegamento bibliografia", siteUrl: "Indirizzo pubblico del sito",
  personDescription: "Descrizione profilo strutturato", socialImageAlt: "Descrizione accessibile immagine social",
  keywords: "Parole chiave", googleVerification: "Codice verifica Google Search Console",
};

function labelFor(key: string) {
  return fieldLabels[key] ?? key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (s) => s.toUpperCase());
}

function isObject(value: Value): value is { [key: string]: Value } {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isBilingual(value: Value): value is { en: string; it: string } {
  return isObject(value) && typeof value.en === "string" && typeof value.it === "string";
}

function blankLike(value: Value): Value {
  if (Array.isArray(value)) return [];
  if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, blankLike(entry)]));
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}

function templateAt(path: Path): Value | undefined {
  return portfolioArrayTemplates[path.filter((segment) => typeof segment === "string").join(".")];
}

function itemTitle(value: Value, index: number) {
  if (isObject(value)) {
    for (const key of ["name", "title", "course", "label", "text", "event", "value"]) {
      const candidate = value[key];
      if (isBilingual(candidate) && (candidate.it || candidate.en)) return candidate.it || candidate.en;
      if (typeof candidate === "string" && candidate.trim()) return candidate;
    }
  }
  return `Nuova voce ${index + 1}`;
}

function TextField({ value, label, multiline = false, onChange }: { value: string; label: string; multiline?: boolean; onChange: (value: string) => void }) {
  const long = multiline || /descrizione|testo|introduzione|contesto|paragrafo|presentazione|tematiche/i.test(label);
  return (
    <label className={styles.label}>
      {label}
      {long ? (
        <textarea className={styles.textArea} rows={3} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={styles.input} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function CollectionEditor({ value, path, label, onChange }: { value: Value[]; path: Path; label: string; onChange: (value: Value[]) => void }) {
  // Keep keys independent from user-edited titles; reorder also preserves focus identity.
  const [ids, setIds] = useState(() => value.map((_, index) => `row-${index}`));
  const [open, setOpen] = useState<Set<string>>(new Set());

  function add() {
    const id = window.crypto.randomUUID();
    const template = templateAt(path) ?? value[0] ?? { text: { en: "", it: "" } };
    setIds((current) => [...current, id]);
    setOpen((current) => new Set(current).add(id));
    onChange([...value, blankLike(template)]);
  }

  function move(index: number, direction: number) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    const nextIds = [...ids];
    [nextIds[index], nextIds[target]] = [nextIds[target], nextIds[index]];
    setIds(nextIds);
    onChange(next);
  }

  return (
    <section className={styles.objectGroup} aria-label={label}>
      <div className={styles.groupTitle}>
        <h3>{label} <span>({value.length})</span></h3>
        <button className={styles.smallButton} type="button" onClick={add}>+ Aggiungi voce</button>
      </div>
      <div className={styles.repeatList}>
        {value.map((entry, index) => {
          const id = ids[index] ?? `row-${index}`;
          return (
            <details className={styles.repeatCard} key={id} open={open.has(id)} onToggle={(event) => {
              const expanded = event.currentTarget.open;
              setOpen((current) => {
                if (current.has(id) === expanded) return current;
                const next = new Set(current);
                if (expanded) next.add(id); else next.delete(id);
                return next;
              });
            }}>
              <summary className={styles.repeatSummary}><span className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</span><strong>{itemTitle(entry, index)}</strong></summary>
              <div className={styles.repeatBody}>
                <Fields value={entry} path={[...path, index]} label={label} onChange={(next) => onChange(value.map((item, i) => i === index ? next : item))} />
                <div className={styles.repeatActions}>
                  <button type="button" className={styles.smallButton} disabled={index === 0} onClick={() => move(index, -1)}>↑ Sposta su</button>
                  <button type="button" className={styles.smallButton} disabled={index === value.length - 1} onClick={() => move(index, 1)}>↓ Sposta giù</button>
                  <button type="button" className={styles.dangerButton} onClick={() => {
                    if (!window.confirm(`Rimuovere “${itemTitle(entry, index)}”? La modifica sarà pubblicata solo al salvataggio.`)) return;
                    setIds((current) => current.filter((_, i) => i !== index));
                    onChange(value.filter((_, i) => i !== index));
                  }}>Rimuovi voce</button>
                </div>
              </div>
            </details>
          );
        })}
        {!value.length && <p className={styles.emptyCollection}>Nessuna voce. Usa “Aggiungi voce” per iniziare.</p>}
      </div>
    </section>
  );
}

function Fields({ value, path, label, onChange }: { value: Value; path: Path; label: string; onChange: (value: Value) => void }) {
  if (isBilingual(value)) {
    return (
      <div className={styles.bilingualField}>
        <p className={styles.fieldCaption}>{label}</p>
        <div className={styles.languageField}><TextField label="English" multiline value={value.en} onChange={(en) => onChange({ ...value, en })} /></div>
        <div className={styles.languageField}><TextField label="Italiano" multiline value={value.it} onChange={(it) => onChange({ ...value, it })} /></div>
      </div>
    );
  }
  if (Array.isArray(value)) return <CollectionEditor value={value} path={path} label={label} onChange={onChange} />;
  if (isObject(value)) {
    return <div className={styles.contentGrid}>{Object.entries(value).map(([key, entry]) => (
      <Fields key={key} label={labelFor(key)} path={[...path, key]} value={entry} onChange={(next) => onChange({ ...value, [key]: next })} />
    ))}</div>;
  }
  if (typeof value === "boolean") return <label className={styles.checkRow}><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />{label}</label>;
  if (typeof value === "number") return <label className={styles.label}>{label}<input className={styles.input} type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
  return <TextField label={label} value={value ?? ""} onChange={onChange} />;
}

export function PortfolioEditor({ portfolio, section, onChange }: { portfolio: PortfolioContent; section: ContentSectionId; onChange: (value: PortfolioContent) => void }) {
  return <Fields value={portfolio[section] as unknown as Value} label={labelFor(section)} path={[section]} onChange={(next) => onChange({ ...portfolio, [section]: next } as PortfolioContent)} />;
}
