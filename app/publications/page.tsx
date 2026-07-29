"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitch } from "../language-switch";
import { useLanguage } from "../language-context";
import { MailIcon } from "../mail-icon";
import { translate } from "../translations";
import {
  conferencePublications,
  journalPublications,
  type Publication,
} from "../publications";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => `${publicBasePath}${path}`;

const profileLinks = [
  {
    label: "ORCID",
    href: "https://orcid.org/0000-0002-9081-2648",
    icon: publicAsset("/brands/orcid.svg"),
  },
  {
    label: "Scholar",
    href: "https://scholar.google.com/citations?user=VjT72dQAAAAJ",
    icon: publicAsset("/brands/google-scholar.svg"),
  },
  {
    label: "Scopus",
    href: "https://www.scopus.com/authid/detail.uri?authorId=57211783669",
    icon: publicAsset("/brands/scopus.svg"),
  },
];

function PublicationGroup({
  id,
  eyebrow,
  publications,
  startAt,
}: {
  id: string;
  eyebrow: string;
  publications: Publication[];
  startAt: number;
}) {
  const { language } = useLanguage();
  const t = (text: string) => translate(language, text);

  return (
    <section className="bibliography-group" id={id}>
      <div className="bibliography-group-heading">
        <p>{t(eyebrow)}</p>
        <span>
          {publications.length.toString().padStart(2, "0")} {t("records")}
        </span>
      </div>

      <div className="bibliography-list">
        {publications.map((publication, index) => (
          <a
            className="bibliography-row"
            href={publication.href}
            key={publication.title}
            rel="noreferrer"
            target="_blank"
          >
            <span className="bibliography-number">
              {(startAt + index).toString().padStart(2, "0")}
            </span>
            <span className="bibliography-year">{publication.year}</span>
            <span className="bibliography-main">
              <strong>{publication.title}</strong>
              <span>{publication.venue}</span>
            </span>
            <span className="bibliography-link">
              <small>
                {publication.doi ? "DOI" : t("Official record")}
              </small>
              <span>{publication.doi ?? t("Publisher page")}</span>
              <strong aria-hidden="true">↗</strong>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function PublicationsPage() {
  const { language } = useLanguage();
  const t = (text: string) => translate(language, text);
  const publicationCount =
    journalPublications.length + conferencePublications.length;

  return (
    <main className="bibliography-page">
      <header className="site-header">
        <Link
          className="brand"
          href="/"
          aria-label={
            language === "it"
              ? "Paolo Sorino — Pagina iniziale"
              : "Paolo Sorino — Home"
          }
        >
          <span className="brand-mark" aria-hidden="true">
            PS
          </span>
          <span className="brand-name">Paolo Sorino</span>
        </Link>

        <nav className="main-nav" aria-label={t("Primary navigation")}>
          <Link href="/#about">{t("About")}</Link>
          <Link href="/#research">{t("Research")}</Link>
          <Link href="/#projects">{t("Projects")}</Link>
          <Link aria-current="page" href="/publications">
            {t("Publications")}
          </Link>
          <Link href="/#teaching">{t("Teaching")}</Link>
        </nav>

        <div className="header-tools">
          <LanguageSwitch />
          <a
            aria-label={t("Email Paolo Sorino")}
            className="header-cta"
            href="mailto:paolo.sorino@poliba.it"
          >
            <MailIcon />
          </a>
        </div>
      </header>

      <section className="bibliography-hero section-shell">
        <Link className="bibliography-back" href="/">
          <span aria-hidden="true">←</span> {t("Back to portfolio")}
        </Link>
        <div>
          <p className="section-kicker">{t("Complete bibliography")}</p>
          <h1>
            {t("Publications,")}
            <br />
            <em>{t("with direct access.")}</em>
          </h1>
        </div>
        <div className="bibliography-intro">
          <p>
            {t(
              "The complete publication list from my current academic CV. Every DOI opens the canonical publication record; entries without a DOI point to the official proceedings page.",
            )}
          </p>
          <div className="profile-links" aria-label={t("Academic profiles")}>
            {profileLinks.map((profile) => (
              <a
                href={profile.href}
                key={profile.label}
                rel="noreferrer"
                target="_blank"
              >
                <span className="profile-icon" aria-hidden="true">
                  <Image alt="" height={22} src={profile.icon} width={22} />
                </span>
                <span className="profile-label">{profile.label}</span>
                <span className="profile-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
          <nav
            className="bibliography-jumps"
            aria-label={t("Publication categories")}
          >
            <a href="#journals">{t("Journal articles")}</a>
            <a href="#conferences">{t("Conferences & workshops")}</a>
          </nav>
        </div>
      </section>

      <section
        aria-label={t("Publication overview")}
        className="bibliography-overview section-shell"
      >
        <div>
          <strong>{publicationCount}</strong>
          <span>{t("Scientific publications")}</span>
        </div>
        <div>
          <strong>{journalPublications.length}</strong>
          <span>{t("Journal articles")}</span>
        </div>
        <div>
          <strong>{conferencePublications.length}</strong>
          <span>{t("Conference & workshop papers")}</span>
        </div>
        <div>
          <strong>2019—2026</strong>
          <span>{t("Publication period")}</span>
        </div>
      </section>

      <div className="bibliography-content section-shell">
        <PublicationGroup
          id="journals"
          eyebrow="Journal articles"
          publications={journalPublications}
          startAt={1}
        />
        <PublicationGroup
          id="conferences"
          eyebrow="Conference & workshop publications"
          publications={conferencePublications}
          startAt={journalPublications.length + 1}
        />
      </div>

      <footer className="bibliography-footer section-shell">
        <p>
          {t(
            "Bibliography based on the current academic CV. DOI and publisher links have been individually verified.",
          )}
        </p>
        <Link href="/">
          {t("Return to portfolio")} <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </main>
  );
}
