"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitch } from "../language-switch";
import { useLanguage } from "../language-context";
import { MailIcon } from "../mail-icon";
import { translate } from "../translations";
import { initialPortfolio as content, localize, publicAsset } from "../portfolio-content";
import {
  conferencePublications,
  journalPublications,
  publicationCount,
  publicationPeriod,
  type Publication,
} from "../publications";

const profileLinks = content.profile.links.filter((profile) => profile.inPublications && profile.href);

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
            href={publicAsset(publication.href)}
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
  const loc = (value: { en: string; it: string }) => localize(value, language);

  return (
    <main className="bibliography-page">
      <header className="site-header">
        <Link
          className="brand"
          href="/"
          aria-label={
            `${content.profile.name} — ${t("Home")}`
          }
        >
          <span className="brand-mark" aria-hidden="true">
            {content.profile.initials}
          </span>
          <span className="brand-name">{content.profile.name}</span>
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
            aria-label={`${t("Email")} ${content.profile.name}`}
            className="header-cta"
            href={`mailto:${content.profile.email}`}
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
          <p className="section-kicker">{loc(content.publicationsPage.kicker)}</p>
          <h1>
            {loc(content.publicationsPage.title)}
            <br />
            <em>{loc(content.publicationsPage.titleAccent)}</em>
          </h1>
        </div>
        <div className="bibliography-intro">
          <p>
            {loc(content.publicationsPage.description)}
          </p>
          <div className="profile-links" aria-label={t("Academic profiles")}>
            {profileLinks.map((profile, index) => (
              <a
                href={publicAsset(profile.href)}
                key={index}
                rel="noreferrer"
                target="_blank"
              >
                {profile.icon ? <span className="profile-icon" aria-hidden="true">
                  <Image alt="" height={22} src={publicAsset(profile.icon)} unoptimized width={22} />
                </span> : null}
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
          <span>{loc(content.metrics.publicationsLabel)}</span>
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
          <strong>{publicationPeriod}</strong>
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
          {loc(content.publicationsPage.footer)}
        </p>
        <Link href="/">
          {t("Return to portfolio")} <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </main>
  );
}
