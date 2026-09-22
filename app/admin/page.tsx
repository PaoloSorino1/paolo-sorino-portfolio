"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import publicationContent from "../../content/publications.json";
import siteContent from "../../content/site.json";
import type { Publication, PublicationCategory } from "../publications";
import { initialPortfolio, validatePortfolio, type PortfolioContent } from "../portfolio-content";
import { PortfolioEditor, contentSections, type ContentSectionId } from "./portfolio-editor";
import { githubRequest, GitHubApiError } from "./github-client";
import styles from "./admin.module.css";

const REPOSITORY = "PaoloSorino1/paolo-sorino-portfolio";
const BRANCH = "main";
const PUBLICATIONS_PATH = "content/publications.json";
const SITE_CONTENT_PATH = "content/site.json";
const PORTFOLIO_PATH = "content/portfolio.json";
const CV_REPOSITORY_PATH = "public/documents/Paolo-Sorino-CV.pdf";
const CV_PUBLIC_PATH = "/documents/Paolo-Sorino-CV.pdf";
const MAX_CV_BYTES = 8 * 1024 * 1024;
const NEW_TOKEN_URL = "https://github.com/settings/personal-access-tokens/new?name=Portfolio+Content+Studio&target_name=PaoloSorino1&expires_in=90&contents=write";

type ManagedPublication = Publication & {
  _clientId: string;
  featured: boolean;
  focusEn: string;
  focusIt: string;
};

type SiteContent = {
  cvFile: string;
  cvMetaEn: string;
  cvMetaIt: string;
};

type GitHubUser = {
  login: string;
  name: string | null;
};

type GitHubRepository = {
  permissions?: {
    admin?: boolean;
    maintain?: boolean;
    push?: boolean;
    triage?: boolean;
    pull?: boolean;
  };
};

type GitHubFile = {
  content: string;
  encoding: "base64" | "none";
  name: string;
  path: string;
  sha: string;
};

type GitHubWriteResult = {
  content: {
    sha: string;
  } | null;
};

type StatusMessage = {
  kind: "error" | "success" | "notice";
  text: string;
  details?: string;
} | null;

function errorStatus(error: unknown, fallback: string): StatusMessage {
  return { kind: "error", text: error instanceof Error ? error.message : fallback,
    ...(error instanceof GitHubApiError ? { details: error.details } : {}) };
}

function StatusNotice({ status }: { status: StatusMessage }) {
  if (!status) return null;
  return <div className={styles[status.kind]}>
    <p role={status.kind === "error" ? "alert" : "status"} style={{ margin: 0 }}>{status.text}</p>
    {status.details && <details className={styles.diagnostics}><summary>Dettagli tecnici · senza token</summary><pre>{status.details}</pre></details>}
  </div>;
}

function toManagedPublication(
  publication: Publication,
  clientId: string,
): ManagedPublication {
  return {
    ...publication,
    _clientId: clientId,
    featured: publication.featured ?? false,
    focusEn: publication.focusEn ?? "",
    focusIt: publication.focusIt ?? "",
  };
}

const initialPublications = publicationContent.publications.map(
  (publication, index) =>
    toManagedPublication(publication as Publication, `initial-${index}`),
);

const initialSiteContent = siteContent as SiteContent;

function pathForApi(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function decodeBase64Text(value: string) {
  const binary = window.atob(value.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
}

function bytesToBase64(bytes: Uint8Array) {
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(index, Math.min(index + chunkSize, bytes.length)),
    );
  }

  return window.btoa(binary);
}

function encodeBase64Text(value: string) {
  return bytesToBase64(new TextEncoder().encode(value));
}

async function readRepositoryFile(token: string, path: string) {
  return githubRequest<GitHubFile>(
    token,
    `/repos/${REPOSITORY}/contents/${pathForApi(path)}?ref=${encodeURIComponent(BRANCH)}`,
    { headers: { Accept: "application/vnd.github.object+json" } },
  );
}

async function repositoryFileSha(token: string, path: string) {
  try {
    return (await readRepositoryFile(token, path)).sha;
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

async function writeRepositoryFile(
  token: string,
  path: string,
  content: string,
  message: string,
  sha?: string,
) {
  return githubRequest<GitHubWriteResult>(
    token,
    `/repos/${REPOSITORY}/contents/${pathForApi(path)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branch: BRANCH,
        content,
        message,
        ...(sha ? { sha } : {}),
      }),
    },
  );
}

function normalizeDoi(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "");
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function cleanPublication(publication: ManagedPublication): Publication {
  const doi = normalizeDoi(publication.doi ?? "");
  const focusEn = publication.focusEn.trim();
  const focusIt = publication.focusIt.trim();

  return {
    year: publication.year.trim(),
    category: publication.category,
    title: publication.title.trim(),
    venue: publication.venue.trim(),
    ...(doi ? { doi } : {}),
    href: publication.href.trim(),
    featured: publication.featured,
    ...(focusEn ? { focusEn } : {}),
    ...(focusIt ? { focusIt } : {}),
  };
}

function orderedPublications(publications: ManagedPublication[]) {
  const categoryOrder: Record<PublicationCategory, number> = {
    journal: 0,
    conference: 1,
  };

  return publications
    .map(cleanPublication)
    .sort((left, right) => {
      const categoryDifference =
        categoryOrder[left.category] - categoryOrder[right.category];
      if (categoryDifference !== 0) return categoryDifference;
      return Number.parseInt(right.year, 10) - Number.parseInt(left.year, 10);
    });
}

function validatePublications(publications: ManagedPublication[]) {
  const errors: string[] = [];
  const titles = new Set<string>();
  const dois = new Set<string>();

  if (publications.filter((publication) => publication.featured).length > 4) {
    errors.push("Puoi mostrare al massimo quattro pubblicazioni in homepage.");
  }

  publications.forEach((publication, index) => {
    const position = index + 1;
    const title = publication.title.trim();
    const doi = normalizeDoi(publication.doi ?? "").toLowerCase();

    if (!/^\d{4}$/.test(publication.year.trim())) {
      errors.push(`Voce ${position}: l’anno deve contenere quattro cifre.`);
    }
    if (!title) errors.push(`Voce ${position}: manca il titolo.`);
    if (!publication.venue.trim()) {
      errors.push(`Voce ${position}: manca rivista o conferenza.`);
    }
    if (!isHttpUrl(publication.href.trim())) {
      errors.push(`Voce ${position}: inserisci un link web valido.`);
    }
    if (doi && !/^10\.\d{4,9}\/\S+$/i.test(doi)) {
      errors.push(`Voce ${position}: il formato del DOI non è valido.`);
    }
    if (!(["journal", "conference"] as string[]).includes(publication.category)) {
      errors.push(`Voce ${position}: la categoria non è valida.`);
    }
    if (publication.featured && !publication.focusEn.trim()) {
      errors.push(`Voce ${position}: inserisci il focus inglese per la homepage.`);
    }
    if (publication.featured && !publication.focusIt.trim()) {
      errors.push(`Voce ${position}: inserisci il focus italiano per la homepage.`);
    }

    const titleKey = title.toLocaleLowerCase();
    if (titleKey && titles.has(titleKey)) {
      errors.push(`Titolo duplicato: “${title}”.`);
    }
    if (titleKey) titles.add(titleKey);

    if (doi && dois.has(doi)) errors.push(`DOI duplicato: ${doi}.`);
    if (doi) dois.add(doi);
  });

  return errors;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [publications, setPublications] =
    useState<ManagedPublication[]>(initialPublications);
  const [settings, setSettings] =
    useState<SiteContent>(initialSiteContent);
  const [tab, setTab] = useState<"publications" | "cv" | ContentSectionId>("profile");
  const [portfolio, setPortfolio] = useState<PortfolioContent>(initialPortfolio);
  const [savedPortfolio, setSavedPortfolio] = useState<PortfolioContent>(initialPortfolio);
  const [portfolioSha, setPortfolioSha] = useState<string | null>(null);
  const [dirtySections, setDirtySections] = useState<Set<ContentSectionId>>(new Set());
  const [editorRevision, setEditorRevision] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<
    "all" | "journal" | "conference" | "featured"
  >("all");
  const [expandedPublicationIds, setExpandedPublicationIds] = useState<
    Set<string>
  >(new Set());
  const [cvUpload, setCvUpload] = useState<File | null>(null);
  const [publicationsSha, setPublicationsSha] = useState<string | null>(null);
  const [siteContentSha, setSiteContentSha] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [publicationsDirty, setPublicationsDirty] = useState(false);
  const [cvDirty, setCvDirty] = useState(false);
  const [status, setStatus] = useState<StatusMessage>(null);
  const [replacementToken, setReplacementToken] = useState("");

  const hasUnsavedChanges = publicationsDirty || cvDirty || dirtySections.size > 0;
  const selectedSection = contentSections.find((section) => section.id === tab);

  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges && !busy) return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [hasUnsavedChanges, busy]);

  const counts = useMemo(
    () => ({
      total: publications.length,
      journals: publications.filter(
        (publication) => publication.category === "journal",
      ).length,
      conferences: publications.filter(
        (publication) => publication.category === "conference",
      ).length,
    }),
    [publications],
  );

  const visiblePublications = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return publications
      .map((publication, index) => ({ publication, index }))
      .filter(({ publication }) => {
        const matchesFilter =
          filter === "all" ||
          publication.category === filter ||
          (filter === "featured" && publication.featured);
        const matchesQuery =
          !normalizedQuery ||
          publication.title.toLocaleLowerCase().includes(normalizedQuery) ||
          publication.venue.toLocaleLowerCase().includes(normalizedQuery) ||
          (publication.doi ?? "").toLocaleLowerCase().includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      });
  }, [filter, publications, query]);

  async function connect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanToken = token.trim();

    if (!cleanToken) {
      setStatus({ kind: "error", text: "Inserisci il token GitHub." });
      return;
    }

    setBusy(true);
    setStatus({ kind: "notice", text: "Verifica dell’accesso in corso…" });

    try {
      const [profile, repository] = await Promise.all([
        githubRequest<GitHubUser>(cleanToken, "/user"),
        githubRequest<GitHubRepository>(
          cleanToken,
          `/repos/${REPOSITORY}`,
        ),
      ]);

      if (!repository.permissions?.push) {
        throw new Error(
          `L’account @${profile.login} non risulta autorizzato a modificare ${REPOSITORY}. Usa il token dell’account proprietario o di un collaboratore autorizzato.`,
        );
      }

      const [publicationFile, siteFile, portfolioFile] = await Promise.all([
        readRepositoryFile(cleanToken, PUBLICATIONS_PATH),
        readRepositoryFile(cleanToken, SITE_CONTENT_PATH),
        readRepositoryFile(cleanToken, PORTFOLIO_PATH),
      ]);
      const remotePublications = JSON.parse(
        decodeBase64Text(publicationFile.content),
      ) as { publications: Publication[] };
      const remoteSiteContent = JSON.parse(
        decodeBase64Text(siteFile.content),
      ) as SiteContent;
      const remotePortfolio: unknown = JSON.parse(decodeBase64Text(portfolioFile.content));
      const portfolioErrors = validatePortfolio(remotePortfolio);
      if (portfolioErrors.length) {
        throw new Error(`Il file dei contenuti non è compatibile: ${portfolioErrors.slice(0, 3).join(" ")}`);
      }

      setPublications(
        remotePublications.publications.map((publication, index) =>
          toManagedPublication(publication, `remote-${index}`),
        ),
      );
      setExpandedPublicationIds(new Set());
      setSettings(remoteSiteContent);
      setPublicationsSha(publicationFile.sha);
      setSiteContentSha(siteFile.sha);
      setPortfolio(remotePortfolio as PortfolioContent);
      setSavedPortfolio(remotePortfolio as PortfolioContent);
      setPortfolioSha(portfolioFile.sha);
      setDirtySections(new Set());
      setEditorRevision((revision) => revision + 1);
      setToken(cleanToken);
      setUser(profile);
      setPublicationsDirty(false);
      setCvDirty(false);
      setStatus({
        kind: "notice",
        text: `Account @${profile.login} collegato. Dati caricati da GitHub; il permesso di scrittura del token sarà verificato al salvataggio.`,
      });
    } catch (error) {
      setUser(null);
      setStatus(errorStatus(error, "Impossibile verificare l’accesso GitHub."));
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    if (busy) return;
    if (
      hasUnsavedChanges &&
      !window.confirm("Vuoi uscire senza salvare le modifiche?")
    ) {
      return;
    }
    setToken("");
    setReplacementToken("");
    setUser(null);
    setStatus(null);
    setCvUpload(null);
    setPublicationsSha(null);
    setSiteContentSha(null);
    setPortfolioSha(null);
    setDirtySections(new Set());
    setPublicationsDirty(false);
    setCvDirty(false);
  }

  async function replaceToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const candidate = replacementToken.trim();
    if (!candidate) {
      setStatus({ kind: "error", text: "Inserisci il nuovo token GitHub." });
      return;
    }
    setBusy(true);
    try {
      const [profile, repository] = await Promise.all([
        githubRequest<GitHubUser>(candidate, "/user"),
        githubRequest<GitHubRepository>(candidate, `/repos/${REPOSITORY}`),
      ]);
      if (!repository.permissions?.push) {
        throw new Error(`L’account @${profile.login} non risulta autorizzato a modificare ${REPOSITORY}. Il token precedente e le modifiche locali sono stati conservati.`);
      }
      setToken(candidate);
      setUser(profile);
      setReplacementToken("");
      setStatus({ kind: "notice", text: `Nuovo token attivo per @${profile.login}. Le modifiche locali sono state conservate. Premi Salva nella sezione da aggiornare: GitHub verificherà allora il permesso di scrittura.` });
    } catch (error) {
      setStatus(errorStatus(error, "Impossibile sostituire il token. Le modifiche locali sono state conservate."));
    } finally {
      setBusy(false);
    }
  }

  function downloadDraft() {
    const draft = {
      format: "paolo-portfolio-draft-v1",
      repository: REPOSITORY,
      branch: BRANCH,
      exportedAt: new Date().toISOString(),
      baseShas: { portfolio: portfolioSha, publications: publicationsSha, site: siteContentSha },
      portfolio,
      publications: publications.map((publication) => ({
        year: publication.year, category: publication.category, title: publication.title,
        venue: publication.venue, href: publication.href, doi: publication.doi ?? "",
        featured: publication.featured, focusEn: publication.focusEn, focusIt: publication.focusIt,
      })),
      settings,
      pendingCvName: cvUpload?.name ?? null,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-bozza.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function restoreDraft(file: File | null) {
    if (!file || busy) return;
    if (file.size > 4 * 1024 * 1024) {
      setStatus({ kind: "error", text: "La bozza supera 4 MB. Scegli il file JSON scaricato dalla dashboard." });
      return;
    }
    setBusy(true);
    try {
      const draft = JSON.parse(await file.text());
      if (!draft || draft.format !== "paolo-portfolio-draft-v1" || draft.repository !== REPOSITORY || draft.branch !== BRANCH) {
        throw new Error("Questo file non è una bozza compatibile con il portfolio.");
      }
      if (draft.baseShas?.portfolio !== portfolioSha || draft.baseShas?.publications !== publicationsSha || draft.baseShas?.site !== siteContentSha) {
        throw new Error("La bozza parte da una versione diversa dei file GitHub. Per evitare di sovrascrivere aggiornamenti, confronta il JSON con i dati attuali e riporta le modifiche desiderate. Nessun dato locale è stato sostituito.");
      }
      const portfolioErrors = validatePortfolio(draft.portfolio, "draft");
      if (portfolioErrors.length) throw new Error(`Contenuti della bozza non validi: ${portfolioErrors.slice(0, 3).join(" ")}`);
      if (!Array.isArray(draft.publications) || draft.publications.length > 1000 || draft.publications.some((item: unknown) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return true;
        const record = item as Record<string, unknown>;
        return ["year", "title", "venue", "href"].some((key) => typeof record[key] !== "string") ||
          !["journal", "conference"].includes(String(record.category)) ||
          ["doi", "focusEn", "focusIt"].some((key) => record[key] !== undefined && typeof record[key] !== "string") ||
          (record.featured !== undefined && typeof record.featured !== "boolean");
      })) throw new Error("L’elenco pubblicazioni della bozza non ha una struttura valida.");
      const draftSettings = draft.settings;
      if (!draftSettings || ["cvFile", "cvMetaEn", "cvMetaIt"].some((key) => typeof draftSettings[key] !== "string") ||
        !draftSettings.cvFile.startsWith("/") || draftSettings.cvFile.startsWith("//") || /[\\\u0000-\u0020]/.test(draftSettings.cvFile) ||
        draftSettings.cvFile.split(/[/?#]/).some((part: string) => part === "." || part === "..")) {
        throw new Error("Le impostazioni CV della bozza non sono valide.");
      }
      if (hasUnsavedChanges && !window.confirm("Sostituire le modifiche locali con questa bozza? GitHub non verrà modificato.")) return;
      setPortfolio(draft.portfolio as PortfolioContent);
      setPublications((draft.publications as Publication[]).map((publication, index) => toManagedPublication(publication, `draft-${index}`)));
      setSettings({ cvFile: draftSettings.cvFile, cvMetaEn: draftSettings.cvMetaEn, cvMetaIt: draftSettings.cvMetaIt });
      setDirtySections(new Set(contentSections.map((section) => section.id)));
      setEditorRevision((revision) => revision + 1);
      setExpandedPublicationIds(new Set());
      setQuery("");
      setFilter("all");
      setPublicationsDirty(true);
      setCvDirty(true);
      setCvUpload(null);
      setStatus({ kind: "notice", text: "Bozza ripristinata solo nella dashboard. Salva separatamente le sezioni che vuoi pubblicare." + (draft.pendingCvName ? " Il PDF non è incluso nella bozza: selezionalo nuovamente prima di salvare il CV." : "") });
    } catch (error) {
      setStatus(errorStatus(error, "Impossibile leggere la bozza. I dati locali non sono stati modificati."));
    } finally {
      setBusy(false);
    }
  }

  function updatePortfolio(next: PortfolioContent) {
    if (busy || tab === "cv" || tab === "publications") return;
    setPortfolio(next);
    setDirtySections((current) => new Set(current).add(tab));
  }

  async function savePortfolio() {
    if (busy || !portfolioSha) return;
    const errors = validatePortfolio(portfolio);
    if (errors.length) {
      setStatus({ kind: "error", text: `Controlla i campi: ${errors.slice(0, 5).join(" ")}` });
      return;
    }
    setBusy(true);
    setStatus({ kind: "notice", text: "Salvataggio dei contenuti bilingui su GitHub…" });
    try {
      const result = await writeRepositoryFile(token, PORTFOLIO_PATH,
        encodeBase64Text(`${JSON.stringify(portfolio, null, 2)}\n`),
        `Update portfolio content (${Array.from(dirtySections).join(", ")})`, portfolioSha);
      if (!result.content?.sha) throw new Error("Risposta priva della versione del file. Conserva la bozza e verifica i commit su GitHub prima di riprovare: il salvataggio potrebbe essere avvenuto.");
      setPortfolioSha(result.content.sha);
      setSavedPortfolio(portfolio);
      setDirtySections(new Set());
      setStatus({ kind: "success", text: "Contenuti salvati. La pubblicazione sarà visibile quando GitHub Actions avrà completato il deployment." });
    } catch (error) {
      setStatus(errorStatus(error, "Salvataggio dei contenuti non riuscito."));
    } finally {
      setBusy(false);
    }
  }

  function discardPortfolio() {
    if (busy || !window.confirm("Annullare tutte le modifiche ai contenuti non ancora salvate? Pubblicazioni e CV non saranno modificati.")) return;
    setPortfolio(savedPortfolio);
    setDirtySections(new Set());
    setEditorRevision((revision) => revision + 1);
    setStatus({ kind: "notice", text: "Contenuti ripristinati all’ultima versione caricata o salvata." });
  }

  function addPublication() {
    if (busy) return;
    const year = new Date().getFullYear().toString();
    const clientId = `new-${window.crypto.randomUUID()}`;
    setPublications((current) => [
      {
        _clientId: clientId,
        year,
        category: "journal",
        title: "",
        venue: "",
        doi: "",
        href: "",
        featured: false,
        focusEn: "",
        focusIt: "",
      },
      ...current,
    ]);
    setExpandedPublicationIds((current) => new Set(current).add(clientId));
    setQuery("");
    setFilter("all");
    setPublicationsDirty(true);
    setStatus({
      kind: "notice",
      text: "Nuova voce creata in cima all’elenco. Compila i campi e salva.",
    });
  }

  function updatePublication(
    index: number,
    field: keyof ManagedPublication,
    value: string | boolean,
  ) {
    if (busy) return;
    setPublications((current) =>
      current.map((publication, publicationIndex) => {
        if (publicationIndex !== index) return publication;

        if (field === "doi") {
          const doi = String(value);
          const normalizedDoi = normalizeDoi(doi);
          const shouldUpdateHref =
            !publication.href ||
            /^https?:\/\/(?:dx\.)?doi\.org\//i.test(publication.href);
          return {
            ...publication,
            doi,
            ...(normalizedDoi && shouldUpdateHref
              ? { href: `https://doi.org/${normalizedDoi}` }
              : {}),
          };
        }

        return { ...publication, [field]: value };
      }),
    );
    setPublicationsDirty(true);
  }

  function deletePublication(index: number, title: string) {
    if (busy) return;
    const label = title || "questa nuova voce";
    if (!window.confirm(`Eliminare “${label}”?`)) return;
    const deletedId = publications[index]?._clientId;
    setPublications((current) =>
      current.filter((_, publicationIndex) => publicationIndex !== index),
    );
    setExpandedPublicationIds((expanded) => {
      const next = new Set(expanded);
      if (deletedId) next.delete(deletedId);
      return next;
    });
    setPublicationsDirty(true);
    setStatus({
      kind: "notice",
      text: "La voce è stata rimossa localmente. Premi Salva per confermare.",
    });
  }

  async function savePublications() {
    if (busy) return;
    if (!publicationsSha) {
      setStatus({
        kind: "error",
        text: "Versione dell’archivio non disponibile. Scarica la bozza prima di ricaricare la dashboard.",
      });
      return;
    }

    const errors = validatePublications(publications);
    if (errors.length) {
      setStatus({
        kind: "error",
        text: errors.slice(0, 4).join(" "),
      });
      return;
    }

    setBusy(true);
    setStatus({ kind: "notice", text: "Salvataggio su GitHub in corso…" });

    try {
      const ordered = orderedPublications(publications);
      const result = await writeRepositoryFile(
        token,
        PUBLICATIONS_PATH,
        encodeBase64Text(
          `${JSON.stringify({ publications: ordered }, null, 2)}\n`,
        ),
        `Update portfolio publications (${ordered.length} records)`,
        publicationsSha,
      );
      if (!result.content?.sha) throw new Error("Risposta priva della versione del file. Conserva la bozza e verifica i commit su GitHub prima di riprovare: il salvataggio potrebbe essere avvenuto.");
      setPublications(
        ordered.map((publication, index) =>
          toManagedPublication(publication, `saved-${index}`),
        ),
      );
      setExpandedPublicationIds(new Set());
      setPublicationsSha(result.content.sha);
      setPublicationsDirty(false);
      setStatus({
        kind: "success",
        text: `Salvate ${ordered.length} pubblicazioni. GitHub Actions sta aggiornando il sito.`,
      });
    } catch (error) {
      setStatus(errorStatus(error, "Salvataggio delle pubblicazioni non riuscito."));
    } finally {
      setBusy(false);
    }
  }

  function updateSetting(field: keyof SiteContent, value: string) {
    if (busy) return;
    setSettings((current) => ({ ...current, [field]: value }));
    setCvDirty(true);
  }

  function chooseCv(file: File | null) {
    if (busy) return;
    if (!file) {
      setCvUpload(null);
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setCvUpload(null);
      setStatus({ kind: "error", text: "Il CV deve essere un file PDF." });
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setCvUpload(null);
      setStatus({
        kind: "error",
        text: "Il PDF supera 8 MB. Riducilo prima di caricarlo.",
      });
      return;
    }
    setCvUpload(file);
    setCvDirty(true);
    setStatus({
      kind: "notice",
      text: `${file.name} è pronto; verrà caricato soltanto premendo Salva CV.`,
    });
  }

  async function saveCv() {
    if (busy) return;
    if (!siteContentSha) {
      setStatus({
        kind: "error",
        text: "Versione delle impostazioni non disponibile. Scarica la bozza prima di ricaricare la dashboard.",
      });
      return;
    }

    if (!settings.cvMetaEn.trim() || !settings.cvMetaIt.trim()) {
      setStatus({
        kind: "error",
        text: "Compila la descrizione del CV in entrambe le lingue.",
      });
      return;
    }

    setBusy(true);
    setStatus({ kind: "notice", text: "Aggiornamento del CV in corso…" });
    let pdfUploaded = false;

    try {
      let nextSettings = { ...settings };

      if (cvUpload) {
        const sha = await repositoryFileSha(token, CV_REPOSITORY_PATH);
        const fileBytes = new Uint8Array(await cvUpload.arrayBuffer());

        const pdfResult = await writeRepositoryFile(
          token,
          CV_REPOSITORY_PATH,
          bytesToBase64(fileBytes),
          "Upload updated academic CV",
          sha,
        );
        if (!pdfResult.content?.sha) throw new Error("Risposta PDF priva della versione del file. Conserva la bozza e verifica i commit su GitHub prima di riprovare.");
        pdfUploaded = true;
        nextSettings = {
          ...nextSettings,
          cvFile: `${CV_PUBLIC_PATH}?v=${Date.now()}`,
        };
      }

      const settingsResult = await writeRepositoryFile(
        token,
        SITE_CONTENT_PATH,
        encodeBase64Text(`${JSON.stringify(nextSettings, null, 2)}\n`),
        "Update portfolio CV settings",
        siteContentSha,
      );
      if (!settingsResult.content?.sha) throw new Error("Risposta priva della versione delle impostazioni. Conserva la bozza e verifica i commit su GitHub prima di riprovare.");

      setSettings(nextSettings);
      setSiteContentSha(settingsResult.content.sha);
      setCvUpload(null);
      setCvDirty(false);
      setStatus({
        kind: "success",
        text: "CV aggiornato. GitHub Actions sta pubblicando la nuova versione.",
      });
    } catch (error) {
      const failure = errorStatus(error, "Aggiornamento del CV non riuscito.");
      setStatus(pdfUploaded && failure ? { ...failure, text: `Il PDF è stato caricato su GitHub, ma il salvataggio delle impostazioni CV non è confermato. ${failure.text}` } : failure);
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={styles.loginShell}>
          <section className={styles.loginCard}>
            <div className={styles.loginTop}>
              <div className={styles.brandRow}>
                <span className={styles.brandMark} aria-hidden="true">
                  PS
                </span>
                <p>Portfolio · Content Studio</p>
              </div>
              <h1>
                Aggiorna il portfolio,
                <br />
                <em>senza modificare codice.</em>
              </h1>
              <span>
                Un unico spazio per bio, ricerca, progetti, didattica,
                pubblicazioni e curriculum. In inglese e in italiano.
              </span>
            </div>

            <form className={styles.loginForm} onSubmit={connect}>
              <label className={styles.label} htmlFor="github-token">
                Token GitHub fine-grained
                <input
                  autoCapitalize="none"
                  autoComplete="off"
                  className={styles.input}
                  disabled={busy}
                  id="github-token"
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="github_pat_…"
                  spellCheck={false}
                  type="password"
                  value={token}
                />
              </label>
              <p className={styles.loginHint}>
                Crea il token nelle{" "}
                <a
                  href={NEW_TOKEN_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  impostazioni GitHub
                </a>
                : verifica <strong>Resource owner: PaoloSorino1</strong>,
                {" "}seleziona soltanto la repository <strong>{REPOSITORY}</strong>
                {" "}e abilita <strong>Contents: Read and write</strong>.
              </p>
              <button className={styles.primaryButton} disabled={busy} type="submit">
                {busy ? "Verifica…" : "Accedi alla dashboard"}
              </button>
              <div className={styles.securityNote}>
                <span aria-hidden="true">◉</span>
                <span>
                  <strong>Sessione non persistente.</strong> La dashboard mantiene
                  il token soltanto nella memoria di questa scheda e non lo
                  scrive nei file del sito.
                </span>
              </div>
              <StatusNotice status={status} />
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerBrand}>
          <span className={styles.brandMark} aria-hidden="true">
            PS
          </span>
          <div>
            <p>Portfolio · Content Studio</p>
            <span>Repository · {REPOSITORY}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link className={styles.backLink} href="/" target="_blank">
            Apri il portfolio ↗
          </Link>
          <div className={styles.userMeta}>
            <span>@{user.login}</span>
            <button
              className={styles.ghostButton}
              disabled={busy}
              onClick={disconnect}
              type="button"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      <div className={styles.dashboard}>
        <section className={styles.dashboardIntro}>
          <div>
            <p className={styles.eyebrow}>Content dashboard</p>
            <h1>Il tuo profilo, aggiornato.</h1>
          </div>
          <p>
            Scegli una sezione, modifica i contenuti e pubblica quando sei pronto.
            Ogni salvataggio è tracciato su GitHub.
          </p>
        </section>

        <section className={styles.stats} aria-label="Riepilogo pubblicazioni">
          <div className={styles.stat}>
            <strong>{counts.total}</strong>
            <span>Pubblicazioni totali</span>
          </div>
          <div className={styles.stat}>
            <strong>{counts.journals}</strong>
            <span>Journal articles</span>
          </div>
          <div className={styles.stat}>
            <strong>{counts.conferences}</strong>
            <span>Conference papers</span>
          </div>
        </section>

        <details className={styles.connectionTools}>
          <summary>Connessione e bozze · @{user.login}</summary>
          <div className={styles.connectionGrid}>
            <form onSubmit={replaceToken}>
              <p className={styles.fieldHint}>
                Repository: <strong>{REPOSITORY}</strong> · Branch: <strong>{BRANCH}</strong>.
                Puoi cambiare token mantenendo le modifiche aperte.
              </p>
              <label className={styles.label} htmlFor="replacement-token">Nuovo token GitHub
                <input id="replacement-token" type="password" autoComplete="off" autoCapitalize="none"
                  spellCheck={false} className={styles.input} value={replacementToken} disabled={busy}
                  onChange={(event) => setReplacementToken(event.target.value)} placeholder="github_pat_…" />
              </label>
              <div className={styles.connectionActions}>
                <button className={styles.secondaryButton} type="submit" disabled={busy || !replacementToken.trim()}>Usa nuovo token</button>
                <a className={styles.inlineLink} href={NEW_TOKEN_URL} target="_blank" rel="noreferrer">Crea token su GitHub ↗</a>
              </div>
              <p className={styles.fieldHint}>Resource owner: PaoloSorino1 · Only select repositories: paolo-sorino-portfolio · Contents: Read and write. La scrittura viene verificata da GitHub quando salvi.</p>
            </form>
            <div>
              <p className={styles.fieldHint}>Conserva una copia delle modifiche prima di ricaricare o uscire. Il file contiene i testi della dashboard, senza il token e senza il PDF del CV.</p>
              <button className={styles.secondaryButton} type="button" disabled={busy} onClick={downloadDraft}>Scarica bozza</button>
              <label className={`${styles.label} ${styles.draftRestore}`}>Ripristina bozza
                <input type="file" accept=".json,application/json" aria-label="Ripristina bozza" disabled={busy}
                  className={styles.input} onChange={(event) => { const file = event.target.files?.[0] ?? null; event.target.value = ""; void restoreDraft(file); }} />
              </label>
              <p className={styles.fieldHint}>Il ripristino è locale e richiede la stessa versione dei file GitHub. Per un nuovo CV seleziona di nuovo il PDF.</p>
            </div>
          </div>
        </details>

        <div className={styles.studioLayout}>
          <aside className={styles.studioSidebar}>
            <p className={styles.sidebarLabel}>Contenuti del sito</p>
            <nav className={styles.sidebarNav} aria-label="Sezioni dashboard">
              {contentSections.map((section) => (
                <button key={section.id} type="button" disabled={busy}
                  className={`${styles.sidebarButton} ${tab === section.id ? styles.sidebarButtonActive : ""}`}
                  aria-current={tab === section.id ? "page" : undefined}
                  onClick={() => setTab(section.id)}>
                  {section.label}
                  {dirtySections.has(section.id) && <span className={styles.sidebarDot} aria-label="Modifiche non salvate" />}
                </button>
              ))}
              <p className={styles.sidebarLabel}>Archivio e documenti</p>
              <button type="button" disabled={busy} onClick={() => setTab("publications")}
                className={`${styles.sidebarButton} ${tab === "publications" ? styles.sidebarButtonActive : ""}`}
                aria-current={tab === "publications" ? "page" : undefined}>Pubblicazioni {publicationsDirty && <span className={styles.sidebarDot} aria-label="Modifiche non salvate" />}</button>
              <button type="button" disabled={busy} onClick={() => setTab("cv")}
                className={`${styles.sidebarButton} ${tab === "cv" ? styles.sidebarButtonActive : ""}`}
                aria-current={tab === "cv" ? "page" : undefined}>Curriculum PDF {cvDirty && <span className={styles.sidebarDot} aria-label="Modifiche non salvate" />}</button>
            </nav>
            <p className={styles.sidebarFootnote}>Accesso autorizzato da GitHub. Il token non viene memorizzato dalla dashboard.</p>
            <a className={styles.inlineLink} href={`https://github.com/${REPOSITORY}/actions`} target="_blank" rel="noreferrer">Stato pubblicazione ↗</a>
          </aside>
          <div className={styles.studioMain} aria-busy={busy}>
          <StatusNotice status={status} />

        {tab === "publications" ? (
          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Archivio scientifico</h2>
                <p>
                  Il totale e le categorie del sito vengono calcolati da questo
                  unico elenco. I record sono ordinati automaticamente per anno.
                </p>
              </div>
              <button
                className={styles.secondaryButton}
                disabled={busy}
                onClick={addPublication}
                type="button"
              >
                + Nuova pubblicazione
              </button>
            </div>

            <fieldset className={styles.editorFieldset} disabled={busy}>
            <div className={styles.toolbar}>
              <input
                aria-label="Cerca pubblicazioni"
                className={`${styles.input} ${styles.searchInput}`}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cerca titolo, venue o DOI…"
                type="search"
                value={query}
              />
              <select
                aria-label="Filtra pubblicazioni"
                className={styles.select}
                onChange={(event) =>
                  setFilter(
                    event.target.value as
                      | "all"
                      | "journal"
                      | "conference"
                      | "featured",
                  )
                }
                value={filter}
              >
                <option value="all">Tutte</option>
                <option value="journal">Journal</option>
                <option value="conference">Conferenze</option>
                <option value="featured">In homepage</option>
              </select>
            </div>

            <div className={styles.publicationList}>
              {visiblePublications.length ? (
                visiblePublications.map(({ publication, index }) => (
                  <details
                    className={styles.publicationCard}
                    key={publication._clientId}
                    onToggle={(event) => {
                      const clientId = publication._clientId;
                      const isOpen = event.currentTarget.open;
                      setExpandedPublicationIds((current) => {
                        const next = new Set(current);
                        if (isOpen) next.add(clientId);
                        else next.delete(clientId);
                        return next;
                      });
                    }}
                    open={expandedPublicationIds.has(publication._clientId)}
                  >
                    <summary className={styles.publicationSummary}>
                      <span className={styles.publicationSummaryText}>
                        <strong>{publication.title || "Nuova pubblicazione"}</strong>
                        <span>
                          {publication.year || "Anno"} · {publication.venue || "Venue da inserire"}
                        </span>
                      </span>
                      <span className={styles.categoryBadge}>
                        {publication.category === "journal" ? "Journal" : "Conference"}
                      </span>
                      {publication.featured && (
                        <span className={styles.featuredBadge}>Homepage</span>
                      )}
                    </summary>

                    <div className={styles.publicationFields}>
                      <label className={styles.label}>
                        Anno
                        <input
                          className={styles.input}
                          inputMode="numeric"
                          maxLength={4}
                          onChange={(event) =>
                            updatePublication(index, "year", event.target.value)
                          }
                          value={publication.year}
                        />
                      </label>
                      <label className={styles.label}>
                        Categoria
                        <select
                          className={styles.select}
                          onChange={(event) =>
                            updatePublication(
                              index,
                              "category",
                              event.target.value as PublicationCategory,
                            )
                          }
                          value={publication.category}
                        >
                          <option value="journal">Journal article</option>
                          <option value="conference">Conference / workshop</option>
                        </select>
                      </label>
                      <label className={`${styles.label} ${styles.spanTwo}`}>
                        Titolo completo
                        <textarea
                          className={styles.textArea}
                          onChange={(event) =>
                            updatePublication(index, "title", event.target.value)
                          }
                          value={publication.title}
                        />
                      </label>
                      <label className={`${styles.label} ${styles.spanTwo}`}>
                        Rivista, conferenza, volume e pagine
                        <input
                          className={styles.input}
                          onChange={(event) =>
                            updatePublication(index, "venue", event.target.value)
                          }
                          value={publication.venue}
                        />
                      </label>
                      <label className={styles.label}>
                        DOI (senza https://doi.org/)
                        <input
                          className={styles.input}
                          onChange={(event) =>
                            updatePublication(index, "doi", event.target.value)
                          }
                          placeholder="10.xxxx/…"
                          value={publication.doi ?? ""}
                        />
                      </label>
                      <label className={styles.label}>
                        Link ufficiale
                        <input
                          className={styles.input}
                          onChange={(event) =>
                            updatePublication(index, "href", event.target.value)
                          }
                          placeholder="https://…"
                          type="url"
                          value={publication.href}
                        />
                      </label>
                      <label className={`${styles.checkRow} ${styles.spanTwo}`}>
                        <input
                          checked={publication.featured}
                          onChange={(event) =>
                            updatePublication(index, "featured", event.target.checked)
                          }
                          type="checkbox"
                        />
                        Mostra questa pubblicazione anche nella homepage
                      </label>
                      {publication.featured && (
                        <>
                          <label className={styles.label}>
                            Focus breve · inglese
                            <input
                              className={styles.input}
                              onChange={(event) =>
                                updatePublication(index, "focusEn", event.target.value)
                              }
                              placeholder="Healthcare AI · XAI"
                              value={publication.focusEn}
                            />
                          </label>
                          <label className={styles.label}>
                            Focus breve · italiano
                            <input
                              className={styles.input}
                              onChange={(event) =>
                                updatePublication(index, "focusIt", event.target.value)
                              }
                              placeholder="IA per la sanità · XAI"
                              value={publication.focusIt}
                            />
                          </label>
                        </>
                      )}
                      <div className={styles.publicationActions}>
                        <button
                          className={styles.dangerButton}
                          onClick={() => deletePublication(index, publication.title)}
                          type="button"
                        >
                          Elimina voce
                        </button>
                      </div>
                    </div>
                  </details>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Nessuna pubblicazione corrisponde alla ricerca.
                </div>
              )}
            </div>

            <div className={styles.panelFooter}>
              <p>
                {publicationsDirty
                  ? "Sono presenti modifiche non ancora salvate."
                  : "I dati visualizzati corrispondono all’ultimo salvataggio."}
              </p>
              <button
                className={styles.primaryButton}
                disabled={busy || !publicationsDirty}
                onClick={savePublications}
                type="button"
              >
                {busy ? "Salvataggio…" : `Salva ${counts.total} pubblicazioni`}
              </button>
            </div>
            </fieldset>
          </section>
        ) : tab === "cv" ? (
          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Curriculum accademico</h2>
                <p>
                  Carica un nuovo PDF e aggiorna la dicitura mostrata sotto il
                  pulsante di download. Il collegamento viene aggiornato automaticamente.
                </p>
              </div>
            </div>

            <fieldset className={styles.editorFieldset} disabled={busy}>
            <div className={styles.cvGrid}>
              <div className={styles.uploadBox}>
                <strong>Nuovo CV in formato PDF</strong>
                <p className={styles.fieldHint}>
                  File attuale: <code>{settings.cvFile}</code>. Dimensione massima 8 MB.
                </p>
                <input
                  accept="application/pdf,.pdf"
                  onChange={(event) => chooseCv(event.target.files?.[0] ?? null)}
                  type="file"
                />
              </div>
              <label className={styles.label}>
                Descrizione inglese
                <input
                  className={styles.input}
                  onChange={(event) => updateSetting("cvMetaEn", event.target.value)}
                  value={settings.cvMetaEn}
                />
              </label>
              <label className={styles.label}>
                Descrizione italiana
                <input
                  className={styles.input}
                  onChange={(event) => updateSetting("cvMetaIt", event.target.value)}
                  value={settings.cvMetaIt}
                />
              </label>
            </div>

            <div className={styles.panelFooter}>
              <p>
                {cvUpload
                  ? `Pronto per il caricamento: ${cvUpload.name}`
                  : "Puoi modificare anche soltanto le due descrizioni."}
              </p>
              <button
                className={styles.primaryButton}
                disabled={busy || !cvDirty}
                onClick={saveCv}
                type="button"
              >
                {busy ? "Salvataggio…" : "Salva CV"}
              </button>
            </div>
            </fieldset>
          </section>
        ) : selectedSection ? (
          <section className={styles.panel}>
            <div className={styles.panelHeading}><div>
              <p className={styles.eyebrow}>Editor bilingue · EN / IT</p>
              <h2>{selectedSection.label}</h2>
              <p>{selectedSection.note}</p>
            </div></div>
            <fieldset className={styles.editorFieldset} disabled={busy}>
              <PortfolioEditor key={`${tab}-${editorRevision}`} portfolio={portfolio} section={selectedSection.id} onChange={updatePortfolio} />
            </fieldset>
            <div className={`${styles.panelFooter} ${styles.stickySave}`}>
              <div><strong>{dirtySections.size ? `${dirtySections.size} sezioni da salvare` : "Tutte le modifiche salvate"}</strong>
              <p>Il salvataggio include tutte le sezioni editoriali modificate. CV e pubblicazioni si salvano separatamente.</p></div>
              <div className={styles.repeatActions}>
                <button type="button" className={styles.ghostButton} disabled={busy || !dirtySections.size} onClick={discardPortfolio}>Annulla modifiche</button>
                <button type="button" className={styles.primaryButton} disabled={busy || !dirtySections.size} onClick={savePortfolio}>{busy ? "Salvataggio…" : "Salva contenuti"}</button>
              </div>
            </div>
          </section>
        ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
