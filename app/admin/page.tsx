"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import publicationContent from "../../content/publications.json";
import siteContent from "../../content/site.json";
import type { Publication, PublicationCategory } from "../publications";
import styles from "./admin.module.css";

const GITHUB_API = "https://api.github.com";
const REPOSITORY = "PaoloSorino1/paolo-sorino-portfolio";
const BRANCH = "main";
const PUBLICATIONS_PATH = "content/publications.json";
const SITE_CONTENT_PATH = "content/site.json";
const CV_REPOSITORY_PATH = "public/documents/Paolo-Sorino-CV.pdf";
const CV_PUBLIC_PATH = "/documents/Paolo-Sorino-CV.pdf";
const MAX_CV_BYTES = 8 * 1024 * 1024;

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
} | null;

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

async function githubRequest<T>(
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/vnd.github+json");
  }
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("X-GitHub-Api-Version", "2026-03-10");

  const response = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(
        "I dati su GitHub sono cambiati dopo il tuo accesso. Esci, accedi di nuovo e ripeti la modifica.",
      );
    }
    throw new Error(
      payload?.message ?? `GitHub ha risposto con errore ${response.status}.`,
    );
  }

  return payload as T;
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
    if (error instanceof Error && error.message === "Not Found") {
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
  const [tab, setTab] = useState<"publications" | "cv">("publications");
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

  const hasUnsavedChanges = publicationsDirty || cvDirty;

  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [hasUnsavedChanges]);

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
          "Il token non dispone del permesso di scrittura su questa repository.",
        );
      }

      const [publicationFile, siteFile] = await Promise.all([
        readRepositoryFile(cleanToken, PUBLICATIONS_PATH),
        readRepositoryFile(cleanToken, SITE_CONTENT_PATH),
      ]);
      const remotePublications = JSON.parse(
        decodeBase64Text(publicationFile.content),
      ) as { publications: Publication[] };
      const remoteSiteContent = JSON.parse(
        decodeBase64Text(siteFile.content),
      ) as SiteContent;

      setPublications(
        remotePublications.publications.map((publication, index) =>
          toManagedPublication(publication, `remote-${index}`),
        ),
      );
      setExpandedPublicationIds(new Set());
      setSettings(remoteSiteContent);
      setPublicationsSha(publicationFile.sha);
      setSiteContentSha(siteFile.sha);
      setToken(cleanToken);
      setUser(profile);
      setPublicationsDirty(false);
      setCvDirty(false);
      setStatus({
        kind: "success",
        text: "Accesso verificato. I dati più recenti sono stati caricati da GitHub.",
      });
    } catch (error) {
      setUser(null);
      setStatus({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "Impossibile verificare l’accesso GitHub.",
      });
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    if (
      hasUnsavedChanges &&
      !window.confirm("Vuoi uscire senza salvare le modifiche?")
    ) {
      return;
    }
    setToken("");
    setUser(null);
    setStatus(null);
    setCvUpload(null);
    setPublicationsSha(null);
    setSiteContentSha(null);
    setPublicationsDirty(false);
    setCvDirty(false);
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
    if (!publicationsSha) {
      setStatus({
        kind: "error",
        text: "Versione dell’archivio non disponibile. Esci e accedi nuovamente.",
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
      setPublications(
        ordered.map((publication, index) =>
          toManagedPublication(publication, `saved-${index}`),
        ),
      );
      setExpandedPublicationIds(new Set());
      setPublicationsSha(result.content?.sha ?? publicationsSha);
      setPublicationsDirty(false);
      setStatus({
        kind: "success",
        text: `Salvate ${ordered.length} pubblicazioni. GitHub Actions sta aggiornando il sito.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "Salvataggio delle pubblicazioni non riuscito.",
      });
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
    if (!siteContentSha) {
      setStatus({
        kind: "error",
        text: "Versione delle impostazioni non disponibile. Esci e accedi nuovamente.",
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

    try {
      let nextSettings = { ...settings };

      if (cvUpload) {
        const sha = await repositoryFileSha(token, CV_REPOSITORY_PATH);
        const fileBytes = new Uint8Array(await cvUpload.arrayBuffer());

        await writeRepositoryFile(
          token,
          CV_REPOSITORY_PATH,
          bytesToBase64(fileBytes),
          "Upload updated academic CV",
          sha,
        );
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

      setSettings(nextSettings);
      setSiteContentSha(settingsResult.content?.sha ?? siteContentSha);
      setCvUpload(null);
      setCvDirty(false);
      setStatus({
        kind: "success",
        text: "CV aggiornato. GitHub Actions sta pubblicando la nuova versione.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "Aggiornamento del CV non riuscito.",
      });
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
                <p>Portfolio Manager</p>
              </div>
              <h1>
                Aggiorna il portfolio,
                <br />
                <em>senza modificare codice.</em>
              </h1>
              <span>
                Pubblicazioni, contenuti in evidenza e curriculum vengono
                salvati direttamente nella repository ufficiale.
              </span>
            </div>

            <form className={styles.loginForm} onSubmit={connect}>
              <label className={styles.label} htmlFor="github-token">
                Token GitHub fine-grained
                <input
                  autoCapitalize="none"
                  autoComplete="off"
                  className={styles.input}
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
                  href="https://github.com/settings/personal-access-tokens/new"
                  rel="noreferrer"
                  target="_blank"
                >
                  impostazioni GitHub
                </a>
                : seleziona soltanto la repository <strong>{REPOSITORY}</strong>
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
              {status && (
                <p className={styles[status.kind]} role="status">
                  {status.text}
                </p>
              )}
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
            <p>Portfolio Manager</p>
            <span>Repository · {REPOSITORY}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link className={styles.backLink} href="/" target="_blank">
            Apri il portfolio ↗
          </Link>
          <div className={styles.userMeta}>
            <span>{user.name ?? user.login}</span>
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
            <h1>Gestione portfolio</h1>
          </div>
          <p>
            Ogni salvataggio crea una modifica tracciata su GitHub. Il sito si
            aggiorna automaticamente al termine del workflow Pages.
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

        <nav className={styles.tabs} aria-label="Sezioni dashboard">
          <button
            className={`${styles.tab} ${tab === "publications" ? styles.tabActive : ""}`}
            disabled={busy}
            onClick={() => setTab("publications")}
            type="button"
          >
            Pubblicazioni
          </button>
          <button
            className={`${styles.tab} ${tab === "cv" ? styles.tabActive : ""}`}
            disabled={busy}
            onClick={() => setTab("cv")}
            type="button"
          >
            Curriculum
          </button>
        </nav>

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
        ) : (
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
        )}

        {status && (
          <p className={styles[status.kind]} role="status">
            {status.text}
          </p>
        )}
      </div>
    </main>
  );
}
