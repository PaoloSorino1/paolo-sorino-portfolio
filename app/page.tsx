"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitch } from "./language-switch";
import { MailIcon } from "./mail-icon";
import { translate } from "./translations";
import { useLanguage } from "./language-context";
import { featuredPublications, publicationCount } from "./publications";
import siteContent from "../content/site.json";
import { initialPortfolio as content, localize, publicAsset } from "./portfolio-content";
import {
  PROFILE_IMAGE_URL,
  PROFILE_LINKS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./site-config";
const profileStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profile-page`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: ["en", "it"],
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: content.profile.name,
    givenName: content.profile.givenName,
    familyName: content.profile.familyName,
    honorificSuffix: content.profile.suffix,
    url: `${SITE_URL}/`,
    image: PROFILE_IMAGE_URL,
    jobTitle: content.profile.role.en,
    description: content.seo.personDescription.en,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: content.profile.affiliation.en,
      url: content.profile.affiliationUrl,
    },
    sameAs: PROFILE_LINKS,
    knowsAbout: content.profile.expertise.map((item) => item.label.en),
  },
};

const profileLinks = content.profile.links.filter((profile) => profile.href);

function ProfileLink({
  profile,
  showArrow = false,
}: {
  profile: (typeof profileLinks)[number];
  showArrow?: boolean;
}) {
  return (
    <a href={publicAsset(profile.href)} rel="noreferrer" target="_blank">
      {profile.icon ? (
        <span className="profile-icon" aria-hidden="true">
          <Image alt="" height={22} src={publicAsset(profile.icon)} unoptimized width={22} />
        </span>
      ) : null}
      <span className="profile-label">{profile.label}</span>
      {showArrow ? (
        <span className="profile-arrow" aria-hidden="true">
          ↗
        </span>
      ) : null}
    </a>
  );
}

function ResearchIcon({ number }: { number: string }) {
  if (number === "01") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
        <path
          d="M18.5 35.5c-5.8 0-10.5-4.7-10.5-10.5 0-4.2 2.5-7.9 6.1-9.5A10 10 0 0 1 33 14.3a8.5 8.5 0 0 1 2.5 16.6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <circle cx="17" cy="23" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="27.5" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="31.5" cy="29" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        <path d="m19.2 21.9 6.1-2.9m3.1 1.3 2.2 6.3m-11.7-1.4 10.2 3.1M23 34v6m0-6 5-3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    );
  }

  if (number === "02") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
        <rect height="30" rx="3" stroke="currentColor" strokeWidth="1.8" width="27" x="10.5" y="10" />
        <path d="M19 10V7.5h10V10M24 18v13m-6.5-6.5h13" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M16 35.5h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
      <circle cx="17" cy="18" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="32" cy="18" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 38v-4.5c0-5.2 4.3-9.5 9.5-9.5s9.5 4.3 9.5 9.5V38m-2-9.7A9.5 9.5 0 0 1 41 34.5V38" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M21.5 17.5h6" stroke="currentColor" strokeDasharray="2.5 2.5" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export default function Home() {
  const { language } = useLanguage();
  const t = (text: string) => translate(language, text);
  const loc = (value: { en: string; it: string }) => localize(value, language);

  return (
    <main className="portfolio-home">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profileStructuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label={
            `${content.profile.name} — ${t("Home")}`
          }
        >
          <span className="brand-mark" aria-hidden="true">
            {content.profile.initials}
          </span>
          <span className="brand-name">{content.profile.name}</span>
        </a>

        <nav className="main-nav" aria-label={t("Primary navigation")}>
          <a href="#about">{t("About")}</a>
          <a href="#research">{t("Research")}</a>
          <a href="#projects">{t("Projects")}</a>
          <Link href="/publications">{t("Publications")}</Link>
          <a href="#teaching">{t("Teaching")}</a>
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

      <section className="hero section-shell" id="top">
        <span className="hero-dot-field" aria-hidden="true" />
        <span className="hero-orbit" aria-hidden="true" />
        <div className="hero-copy">
          <h1>
            <span className="eyebrow hero-identity">{[content.profile.name, content.profile.suffix].filter(Boolean).join(", ")}</span>
            <span className="hero-name">{loc(content.hero.title)}</span>
            <em>{loc(content.hero.titleAccent)}</em>
          </h1>
          <p className="hero-statement">
            {loc(content.hero.statement)}
          </p>
          <p className="hero-affiliation" title={loc(content.profile.department)}>
            {content.profile.affiliationUrl ? (
              <a href={publicAsset(content.profile.affiliationUrl)} rel="noreferrer" target="_blank">{loc(content.profile.affiliation)}</a>
            ) : loc(content.profile.affiliation)}
            {content.profile.laboratory ? <span> · {content.profile.laboratory}</span> : null}
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#research">
              {loc(content.hero.primaryAction)} <span aria-hidden="true">→</span>
            </a>
            <Link className="button button-text" href="/publications">
              {loc(content.hero.secondaryAction)} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-profiles">
            {profileLinks.map((profile, index) => <ProfileLink key={index} profile={profile} />)}
          </div>
        </div>

        <figure className="hero-art">
          <div className="hero-art-frame">
            <div className="hero-science-layer" aria-hidden="true" />
            <svg
              aria-hidden="true"
              className="hero-visual-data"
              preserveAspectRatio="none"
              viewBox="0 0 640 600"
            >
              <defs>
                <linearGradient
                  id="atlas-area-gradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#0d5194" stopOpacity="0.16" />
                  <stop offset="58%" stopColor="#5f91bf" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="#f7f9f8" stopOpacity="0" />
                </linearGradient>
              </defs>

              <g className="atlas-area-chart">
                <path
                  className="atlas-area-fill"
                  d="M-24 302 C54 283 118 300 183 274 S309 251 378 282 S510 328 670 277 L670 360 C518 398 433 348 362 333 S237 311 165 333 S51 359 -24 341 Z"
                />
                <path
                  className="atlas-area-edge"
                  d="M-24 302 C54 283 118 300 183 274 S309 251 378 282 S510 328 670 277"
                />
                <path
                  className="atlas-area-guide"
                  d="M-24 341 C51 359 93 352 165 333 S290 318 362 333 S518 398 670 360"
                />
              </g>

              <g className="atlas-line-chart">
                <path d="M-26 208 C42 255 77 257 116 201 S173 95 217 169 S281 264 331 181 S389 139 429 207 S493 245 552 188 S624 119 678 153" />
                <path d="M-20 242 C62 215 111 229 173 219 S296 197 365 221 S493 259 668 225" />
              </g>

              <g className="atlas-radial-chart" transform="translate(515 164)">
                <circle className="atlas-radial-guide" r="112" />
                <circle className="atlas-radial-guide atlas-radial-dotted" r="82" />
                <circle className="atlas-radial-guide atlas-radial-soft" r="52" />
                <circle
                  className="atlas-radial-ring atlas-radial-progress"
                  r="96"
                />
                <path
                  className="atlas-radial-arc"
                  d="M0 -68 A68 68 0 0 1 64 23"
                />
              </g>

              <g className="atlas-scatter">
                <circle cx="176" cy="328" r="3.2" />
                <circle cx="195" cy="344" r="2.4" />
                <circle cx="205" cy="319" r="2.8" />
                <circle cx="218" cy="361" r="3.6" />
                <circle cx="229" cy="338" r="2.3" />
                <circle cx="239" cy="376" r="2.9" />
                <circle cx="250" cy="351" r="3.8" />
                <circle cx="262" cy="331" r="2.4" />
                <circle cx="274" cy="368" r="3.2" />
                <circle cx="288" cy="345" r="2.6" />
                <circle cx="301" cy="384" r="3.5" />
                <circle cx="315" cy="358" r="2.2" />
                <circle cx="327" cy="337" r="3" />
                <circle cx="341" cy="374" r="2.8" />
              </g>

              <g className="atlas-data-matrix">
                <rect x="320" y="36" width="8" height="8" rx="2" />
                <rect x="334" y="36" width="8" height="8" rx="2" />
                <rect x="348" y="36" width="8" height="8" rx="2" />
                <rect x="362" y="36" width="8" height="8" rx="2" />
                <rect x="376" y="36" width="8" height="8" rx="2" />
                <rect x="320" y="50" width="8" height="8" rx="2" />
                <rect x="334" y="50" width="8" height="8" rx="2" />
                <rect x="348" y="50" width="8" height="8" rx="2" />
                <rect x="362" y="50" width="8" height="8" rx="2" />
                <rect x="376" y="50" width="8" height="8" rx="2" />
                <rect x="320" y="64" width="8" height="8" rx="2" />
                <rect x="334" y="64" width="8" height="8" rx="2" />
                <rect x="348" y="64" width="8" height="8" rx="2" />
                <rect x="362" y="64" width="8" height="8" rx="2" />
                <rect x="376" y="64" width="8" height="8" rx="2" />
                <rect x="320" y="78" width="8" height="8" rx="2" />
                <rect x="334" y="78" width="8" height="8" rx="2" />
                <rect x="348" y="78" width="8" height="8" rx="2" />
                <rect x="362" y="78" width="8" height="8" rx="2" />
                <rect x="376" y="78" width="8" height="8" rx="2" />
              </g>

              <g className="atlas-bar-chart">
                <path className="atlas-bar-axis" d="M302 553 H414" />
                <rect x="312" y="516" width="10" height="37" rx="3" />
                <rect x="330" y="482" width="10" height="71" rx="3" />
                <rect x="348" y="506" width="10" height="47" rx="3" />
                <rect x="366" y="458" width="10" height="95" rx="3" />
                <rect x="384" y="489" width="10" height="64" rx="3" />
                <rect x="402" y="474" width="10" height="79" rx="3" />
                <path
                  className="atlas-bar-trend"
                  d="M317 505 335 470 353 493 371 446 389 477 407 461"
                />
              </g>

              <g className="atlas-network">
                <path d="M8 439 66 477 112 433 171 474 226 431 282 487" />
                <path d="M8 439 19 528 92 557 171 474 188 579" />
                <path d="M66 477 92 557 145 522 226 431 252 554" />
                <path d="M112 433 145 522 204 530 282 487" />
                <circle cx="8" cy="439" r="5" />
                <circle cx="19" cy="528" r="4" />
                <circle cx="66" cy="477" r="5.5" />
                <circle cx="92" cy="557" r="4.5" />
                <circle cx="112" cy="433" r="4" />
                <circle cx="145" cy="522" r="6" />
                <circle cx="171" cy="474" r="5" />
                <circle cx="188" cy="579" r="4" />
                <circle cx="204" cy="530" r="4.5" />
                <circle cx="226" cy="431" r="5.5" />
                <circle cx="252" cy="554" r="4" />
                <circle cx="282" cy="487" r="5" />
              </g>
            </svg>
            <div className="hero-portrait-layer">
              {content.profile.portrait ? <Image
                alt={
                  loc(content.profile.portraitAlt)
                }
                fill
                priority
                sizes="(max-width: 560px) 78vw, (max-width: 1080px) 520px, 32vw"
                src={publicAsset(content.profile.portrait)}
                unoptimized
              /> : null}
            </div>
            <div className="hero-topic-bubbles">
              {content.hero.topics.map((topic, index) => (
                <span
                  className={`hero-topic-bubble hero-topic-bubble-${index + 1}`}
                  key={index}
                >
                  {loc(topic.label)}
                </span>
              ))}
            </div>
          </div>
          <figcaption className="hero-art-caption">
            <span>{loc(content.research.kicker)}</span>
            <span>{content.profile.laboratory}</span>
          </figcaption>
        </figure>
      </section>

      <section className="research section-shell" id="research">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{loc(content.research.kicker)}</p>
            <h2>{loc(content.research.title)}</h2>
          </div>
          <p>
            {loc(content.research.description)}
          </p>
        </div>

        <div className="research-grid">
          {content.research.items.map((item, index) => (
            <article className="research-card" key={index}>
              <div className="research-card-topline">
                <span className="research-card-icon">
                  <ResearchIcon number={item.number} />
                </span>
                <span className="card-number">{item.number}</span>
              </div>
              <h3>{loc(item.title)}</h3>
              <p>{loc(item.description)}</p>
            </article>
          ))}
        </div>

        <div className="secondary-lines">
          <span>{loc(content.research.secondaryLabel)}</span>
          <p>
            {loc(content.research.secondaryDescription)}
          </p>
        </div>
      </section>

      <section
        className="metrics section-shell"
        aria-label={loc(content.metrics.label)}
      >
        <div>
          <strong>{publicationCount}</strong>
          <span>{loc(content.metrics.publicationsLabel)}</span>
        </div>
        {content.metrics.items.map((item, index) => (
          <div key={index}><strong>{item.value}</strong><span>{loc(item.label)}</span></div>
        ))}
      </section>

      <section className="about section-shell" id="about">
        <p className="section-kicker">{loc(content.about.kicker)}</p>
        <div className="about-grid">
          <h2>
            {loc(content.about.title)}{" "}
            <em>{loc(content.about.titleAccent)}</em>
          </h2>
          <div className="about-copy">
            {content.about.paragraphs.map((paragraph, index) => <p key={index}>{loc(paragraph.text)}</p>)}
            {content.profile.institutionalUrl ? <a
              className="inline-link"
              href={publicAsset(content.profile.institutionalUrl)}
              rel="noreferrer"
              target="_blank"
            >
              {loc(content.about.linkLabel)}{" "}
              <span aria-hidden="true">↗</span>
            </a> : null}
          </div>
        </div>
      </section>

      <section className="projects section-shell" id="projects">
        <div className="section-heading projects-heading">
          <div>
            <p className="section-kicker">{loc(content.projects.kicker)}</p>
            <h2>{loc(content.projects.title)}</h2>
          </div>
          <div>
            <p>
              {loc(content.projects.description)}
            </p>
            <p className="project-note">
              {loc(content.projects.note)}
            </p>
          </div>
        </div>

        <div className="projects-list">
          {content.projects.items.map((project, index) => (
            <article className="project-row" key={index}>
              <div className="project-meta">
                <span>{loc(project.year)}</span>
                <small>{loc(project.accent)}</small>
              </div>
              <div>
                <h3>{loc(project.name)}</h3>
                <p className="project-role">{loc(project.role)}</p>
              </div>
              <p className="project-description">{loc(project.description)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="publications" id="publications">
        <div className="section-shell">
          <div className="publications-topline">
            <div>
              <p className="section-kicker">{loc(content.publicationsPage.selectedKicker)}</p>
              <h2>{loc(content.publicationsPage.selectedTitle)}</h2>
            </div>
            <Link
              className="button button-light"
              href="/publications"
            >
              {loc(content.publicationsPage.completeListLabel)}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="publication-list">
            {featuredPublications.map((publication) => (
              <a
                className="publication-row"
                href={publicAsset(publication.href)}
                key={publication.title}
                rel="noreferrer"
                target="_blank"
              >
                <span className="publication-year">{publication.year}</span>
                <div className="publication-main">
                  <span>
                    {t(
                      publication.category === "journal"
                        ? "Journal article"
                        : "Conference paper",
                    )}
                  </span>
                  <h3>{publication.title}</h3>
                  <p>{publication.venue}</p>
                </div>
                <div className="publication-focus">
                  <span>
                    {language === "it"
                      ? (publication.focusIt ?? publication.focusEn)
                      : publication.focusEn}
                  </span>
                  <strong aria-hidden="true">↗</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="teaching section-shell" id="teaching">
        <div className="teaching-intro">
          <p className="section-kicker">{loc(content.teaching.kicker)}</p>
          <h2>
            {loc(content.teaching.title)} <em>{loc(content.teaching.titleAccent)}</em>
          </h2>
          <p>
            {loc(content.teaching.description)}
          </p>
        </div>

        <div className="teaching-list">
          {content.teaching.items.map((item, index) => (
            <article key={index}>
              <span>{loc(item.period)}</span>
              <div>
                <p>{loc(item.role)}</p>
                <h3>{loc(item.course)}</h3>
                <small>{loc(item.context)}</small>
              </div>
            </article>
          ))}
          <div className="teaching-stats">
            {content.teaching.stats.map((item, index) => (
              <div key={index}><strong>{item.value}</strong><span>{loc(item.label)}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="service">
        <div className="section-shell service-grid">
          <div>
            <p className="section-kicker">{loc(content.service.kicker)}</p>
            <h2>{loc(content.service.title)}</h2>
          </div>
          <div className="service-items">
            {content.service.items.map((item, index) => (
              <article key={index} className={item.highlight ? "service-item-highlight" : undefined}>
                <span>{loc(item.label)}</span><h3>{loc(item.title)}</h3><p>{loc(item.description)}</p>
              </article>
            ))}
          </div>

          <div className="invited-talks">
            <div className="invited-talks-intro">
              <p className="section-kicker">
                {loc(content.talks.kicker)}
              </p>
              <p>
                {loc(content.talks.description)}
              </p>
            </div>

            <div className="invited-talks-list">
              {content.talks.items.map((talk, index) => (
                <article
                  className="invited-talk"
                  key={index}
                >
                  <span className="invited-talk-year">{talk.year}</span>
                  <div>
                    <p className="invited-talk-event">{loc(talk.event)}</p>
                    <h3>{loc(talk.title)}</h3>
                    <p className="invited-talk-context">
                      {loc(talk.context)}
                    </p>
                  </div>
                  {talk.href ? (
                    <a
                      className="invited-talk-link"
                      href={publicAsset(talk.href)}
                      aria-label={
                        `${t("Open the event website")}: ${loc(talk.event)}`
                      }
                      rel="noreferrer"
                      target="_blank"
                    >
                      ↗
                    </a>
                  ) : (
                    <span
                      className="invited-talk-link invited-talk-link-muted"
                      aria-hidden="true"
                    >
                      —
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact section-shell" id="contact">
        <p className="section-kicker">{loc(content.contact.kicker)}</p>
        <div className="contact-main">
          <h2>
            {loc(content.contact.title)}
            <br />
            {loc(content.contact.titleSecondLine)} <em>{loc(content.contact.titleAccent)}</em>
          </h2>
          <div>
            <p>
              {loc(content.contact.description)}
            </p>
            <a className="contact-email" href={`mailto:${content.profile.email}`}>
              {content.profile.email} <span aria-hidden="true">↗</span>
            </a>
            <a
              className="button button-primary cv-button"
              href={publicAsset(siteContent.cvFile)}
              download
            >
              {loc(content.contact.cvLabel)} <span aria-hidden="true">↓</span>
            </a>
            <p className="cv-meta">
              {language === "it" ? siteContent.cvMetaIt : siteContent.cvMetaEn}
            </p>
          </div>
        </div>

        <footer className="site-footer">
          <div>
            <span className="brand-mark" aria-hidden="true">
            {content.profile.initials}
            </span>
            <p>
              {[content.profile.name, content.profile.suffix].filter(Boolean).join(", ")}
              <small>{loc(content.contact.footerAffiliation)}</small>
            </p>
          </div>
          <div className="footer-links">
            {profileLinks.map((profile, index) => (
              <ProfileLink key={index} profile={profile} />
            ))}
          </div>
          <p className="copyright">© {content.profile.copyrightYear} {content.profile.name}</p>
        </footer>
      </section>
    </main>
  );
}
