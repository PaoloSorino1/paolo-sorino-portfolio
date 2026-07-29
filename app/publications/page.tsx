import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  conferencePublications,
  journalPublications,
  type Publication,
} from "../publications";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => `${publicBasePath}${path}`;

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Complete scientific publication list of Paolo Sorino, with verified DOI and official publisher links.",
};

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
  eyebrow,
  publications,
  startAt,
}: {
  eyebrow: string;
  publications: Publication[];
  startAt: number;
}) {
  return (
    <section className="bibliography-group" id={eyebrow === "Journal articles" ? "journals" : "conferences"}>
      <div className="bibliography-group-heading">
        <p>{eyebrow}</p>
        <span>{publications.length.toString().padStart(2, "0")} records</span>
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
              <small>{publication.doi ? "DOI" : "Official record"}</small>
              <span>{publication.doi ?? "Publisher page"}</span>
              <strong aria-hidden="true">↗</strong>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function PublicationsPage() {
  const publicationCount =
    journalPublications.length + conferencePublications.length;

  return (
    <main className="bibliography-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Paolo Sorino — Home">
          <span className="brand-mark" aria-hidden="true">
            PS
          </span>
          <span className="brand-name">Paolo Sorino</span>
        </Link>

        <nav className="main-nav" aria-label="Primary navigation">
          <Link href="/#about">About</Link>
          <Link href="/#research">Research</Link>
          <Link href="/#projects">Projects</Link>
          <Link aria-current="page" href="/publications">
            Publications
          </Link>
          <Link href="/#teaching">Teaching</Link>
        </nav>

        <a className="header-cta" href="mailto:paolo.sorino@poliba.it">
          Connect <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="bibliography-hero section-shell">
        <Link className="bibliography-back" href="/">
          <span aria-hidden="true">←</span> Back to portfolio
        </Link>
        <div>
          <p className="section-kicker">Complete bibliography</p>
          <h1>
            Publications,
            <br />
            <em>with direct access.</em>
          </h1>
        </div>
        <div className="bibliography-intro">
          <p>
            The complete publication list from my current academic CV. Every
            DOI opens the canonical publication record; entries without a DOI
            point to the official proceedings page.
          </p>
          <div className="profile-links" aria-label="Academic profiles">
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
          <nav className="bibliography-jumps" aria-label="Publication categories">
            <a href="#journals">Journal articles</a>
            <a href="#conferences">Conferences & workshops</a>
          </nav>
        </div>
      </section>

      <section
        aria-label="Publication overview"
        className="bibliography-overview section-shell"
      >
        <div>
          <strong>{publicationCount}</strong>
          <span>Scientific publications</span>
        </div>
        <div>
          <strong>{journalPublications.length}</strong>
          <span>Journal articles</span>
        </div>
        <div>
          <strong>{conferencePublications.length}</strong>
          <span>Conference & workshop papers</span>
        </div>
        <div>
          <strong>2019—2026</strong>
          <span>Publication period</span>
        </div>
      </section>

      <div className="bibliography-content section-shell">
        <PublicationGroup
          eyebrow="Journal articles"
          publications={journalPublications}
          startAt={1}
        />
        <PublicationGroup
          eyebrow="Conference & workshop publications"
          publications={conferencePublications}
          startAt={journalPublications.length + 1}
        />
      </div>

      <footer className="bibliography-footer section-shell">
        <p>
          Bibliography based on the current academic CV. DOI and publisher
          links have been individually verified.
        </p>
        <Link href="/">
          Return to portfolio <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </main>
  );
}
