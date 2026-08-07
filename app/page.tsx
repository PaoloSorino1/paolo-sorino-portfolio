"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitch } from "./language-switch";
import { MailIcon } from "./mail-icon";
import { translate } from "./translations";
import { useLanguage } from "./language-context";
import {
  PROFILE_IMAGE_URL,
  PROFILE_LINKS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./site-config";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => `${publicBasePath}${path}`;

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
    "@id": `${SITE_URL}/#paolo-sorino`,
    name: "Paolo Sorino",
    givenName: "Paolo",
    familyName: "Sorino",
    honorificSuffix: "PhD",
    url: `${SITE_URL}/`,
    image: PROFILE_IMAGE_URL,
    jobTitle: "Postdoctoral Researcher",
    description:
      "Researcher in explainable artificial intelligence, artificial intelligence for healthcare, human-machine interaction, and clinical decision support systems.",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Politecnico di Bari",
      url: "https://www.poliba.it/",
    },
    sameAs: PROFILE_LINKS,
    knowsAbout: [
      "Artificial Intelligence in Healthcare",
      "Explainable Artificial Intelligence",
      "Machine Learning",
      "Human-Machine Interaction",
      "Clinical Decision Support Systems",
    ],
  },
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
  {
    label: "GitHub",
    href: "https://github.com/PaoloSorino1",
    icon: publicAsset("/brands/github.svg"),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/paolo-s-17499a1ab/",
    icon: publicAsset("/brands/linkedin.svg"),
  },
];

const heroTopics = [
  "AI in Healthcare",
  "Machine Learning",
  "Explainable AI",
  "Human–Machine Interaction",
  "Clinical Decision Support",
];

const primaryResearch = [
  {
    number: "01",
    title: "Explainable AI in Healthcare",
    description:
      "Interpretable machine learning and deep learning methods that make clinical predictions transparent, inspectable, and actionable.",
  },
  {
    number: "02",
    title: "AI for Clinical Decision Support",
    description:
      "Human-centred predictive systems for risk assessment, patient stratification, and evidence-informed clinical workflows.",
  },
  {
    number: "03",
    title: "Human–Machine Interaction",
    description:
      "Interfaces and interaction models that help people understand, question, and confidently use intelligent systems.",
  },
];

const projects = [
  {
    year: "2026",
    name: "ISCRA-C · CINECA HPC",
    role: "Principal Investigator",
    description:
      "Competitive allocation of national high-performance computing resources for large-scale research in artificial intelligence and data science.",
    accent: "Competitive grant",
  },
  {
    year: "2024—present",
    name: "CALLIOPE · One Health",
    role: "Work-Package Leader",
    description:
      "Technical and scientific coordination of AI, federated learning, XAI, intelligent robotics, sensing, and the integrated One Health platform.",
    accent: "Healthcare AI · XAI",
  },
  {
    year: "2024—2025",
    name: "OMIBREED",
    role: "Work-Package Leader",
    description:
      "AI and explainability pipelines connecting genotype, phenotype, and multi-omics data for biomarker discovery and varietal classification.",
    accent: "AI · Multi-omics",
  },
  {
    year: "2023—2025",
    name: "REACH-XY",
    role: "Work-Package Leader",
    description:
      "AI/XAI methods and interactive systems for early detection, biological treatments, and collaborative research in plant health.",
    accent: "XAI · Interactive systems",
  },
];

const selectedPublications = [
  {
    year: "2026",
    type: "Journal article",
    title:
      "AMIUgraph: analysis and modeling of interactions for utility-driven benchmarking of graph-based models in healthcare",
    venue: "BMC Medical Informatics and Decision Making",
    href: "https://doi.org/10.1186/s12911-026-03717-5",
    focus: "Graph AI · Healthcare benchmarking",
  },
  {
    year: "2025",
    type: "Journal article",
    title:
      "Detecting label noise in longitudinal Alzheimer’s data with explainable artificial intelligence",
    venue: "Brain Informatics",
    href: "https://doi.org/10.1186/s40708-025-00261-2",
    focus: "Explainable AI · Alzheimer’s disease",
  },
  {
    year: "2025",
    type: "Journal article",
    title:
      "MORIX: Machine learning-aided framework for lethality detection and mortality inference with explainable artificial intelligence",
    venue: "Computer Methods and Programs in Biomedicine Update",
    href: "https://doi.org/10.1016/j.cmpbup.2024.100176",
    focus: "Clinical prediction · XAI",
  },
  {
    year: "2024",
    type: "Conference paper",
    title:
      "ARIEL: Brain–Computer Interfaces meet Large Language Models for Emotional Support Conversation",
    venue: "ACM UMAP Adjunct",
    href: "https://doi.org/10.1145/3631700.3665193",
    focus: "Human-centred AI · HMI",
  },
];

const teaching = [
  {
    period: "2025—2026",
    role: "Adjunct Professor",
    course: "Software Design Laboratory",
    context:
      "Bachelor’s degree in Medical Systems Engineering · Politecnico di Bari",
  },
  {
    period: "2026",
    role: "Adjunct Professor · Module E",
    course:
      "2nd-Level Master’s Degree in Artificial Intelligence and Data Science",
    context:
      "Politecnico di Bari · 200 hours of lectures, laboratory sessions, and tutoring",
  },
  {
    period: "2022—2025",
    role: "Assistant Lecturer",
    course: "Foundations of Machine Learning",
    context: "Master’s degree in Computer Engineering · Politecnico di Bari",
  },
];

const invitedTalks = [
  {
    year: "2026",
    event: "ISACT 2026 · IEEE ICHMS 2026",
    title: "AI for BCI with Applications",
    context:
      "Nanyang Technological University, Singapore · 1–3 July 2026",
    href: "https://isact-org.github.io/",
  },
  {
    year: "2026",
    event: "WOA 2026 · Mini-School Lecture",
    title:
      "Artificial Intelligence and Explainable AI in Clinical Decision Support Systems: Innovation, Interpretability, and Trust",
    context: "27th Workshop “From Objects to Agents” · Salerno · 17 June 2026",
    href: "https://sites.google.com/view/woa2026",
  },
  {
    year: "2025",
    event: "IEEE SMC · 15th BMI Systems Workshop",
    title: "Brain Computer Interfaces for Neural Games",
    context:
      "Special event: Integrative Approaches to EEG Signal Analysis",
    href: "https://sites.google.com/view/smc-bmi-workshop2025/",
  },
  {
    year: "2024",
    event: "ISACT 2024 · IEEE SMC Society",
    title: "Artificial Intelligence for Brain-Computer Interaction",
    context:
      "Hosted by University of Naples Federico II · 10–13 December 2024",
    href: "https://isact-org.github.io/",
  },
  {
    year: "2022",
    event: "IEEE BHI-BSN 2022 · Invited Speech",
    title:
      "Real-Time Music Composition Based on AI-Driven Emotion Recognition",
    context:
      "Workshop on enabling technologies for paediatric rehabilitation · Ioannina, Greece · 27–30 September 2022",
  },
];

function ProfileLink({
  profile,
  showArrow = false,
}: {
  profile: (typeof profileLinks)[number];
  showArrow?: boolean;
}) {
  return (
    <a href={profile.href} rel="noreferrer" target="_blank">
      <span className="profile-icon" aria-hidden="true">
        <Image alt="" height={22} src={profile.icon} width={22} />
      </span>
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

  return (
    <main>
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
            language === "it"
              ? "Paolo Sorino — Pagina iniziale"
              : "Paolo Sorino — Home"
          }
        >
          <span className="brand-mark" aria-hidden="true">
            PS
          </span>
          <span className="brand-name">Paolo Sorino</span>
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
            aria-label={t("Email Paolo Sorino")}
            className="header-cta"
            href="mailto:paolo.sorino@poliba.it"
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
            <span className="eyebrow hero-identity">Paolo Sorino, PhD</span>
            <span className="hero-name">{t("Postdoctoral")}</span>
            <em>{t("Researcher")}</em>
          </h1>
          <p className="hero-statement">
            {t("Designing explainable, human-centred AI for healthcare.")}
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#research">
              {t("Explore research")} <span aria-hidden="true">→</span>
            </a>
            <Link className="button button-text" href="/publications">
              {t("View publications")} <span aria-hidden="true">→</span>
            </Link>
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
              <Image
                alt={
                  language === "it"
                    ? "Paolo Sorino durante una presentazione scientifica"
                    : "Paolo Sorino during a scientific presentation"
                }
                fill
                priority
                sizes="(max-width: 560px) 78vw, (max-width: 1080px) 520px, 32vw"
                src={publicAsset("/assets/paolo-sorino-portrait-cutout-hero-v4.png")}
              />
            </div>
            <div className="hero-topic-bubbles">
              {heroTopics.map((topic, index) => (
                <span
                  className={`hero-topic-bubble hero-topic-bubble-${index + 1}`}
                  key={topic}
                >
                  {t(topic)}
                </span>
              ))}
            </div>
          </div>
        </figure>
      </section>

      <section className="research section-shell" id="research">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{t("Research focus")}</p>
            <h2>{t("Three connected perspectives.")}</h2>
          </div>
          <p>
            {t(
              "From model development to explanation and interaction, each line of research is grounded in responsible, clinically meaningful use.",
            )}
          </p>
        </div>

        <div className="research-grid">
          {primaryResearch.map((item) => (
            <article className="research-card" key={item.number}>
              <div className="research-card-topline">
                <span className="research-card-icon">
                  <ResearchIcon number={item.number} />
                </span>
                <span className="card-number">{item.number}</span>
              </div>
              <h3>{t(item.title)}</h3>
              <p>{t(item.description)}</p>
            </article>
          ))}
        </div>

        <div className="secondary-lines">
          <span>{t("Secondary research lines")}</span>
          <p>
            {t(
              "Graph learning & knowledge graphs · Multimodal and privacy-aware AI · Brain–computer interfaces & biosignals",
            )}
          </p>
        </div>
      </section>

      <section
        className="metrics section-shell"
        aria-label={t("Academic highlights")}
      >
        <div>
          <strong>43</strong>
          <span>{t("Scientific publications")}</span>
        </div>
        <div>
          <strong>25+</strong>
          <span>{t("Supervised theses")}</span>
        </div>
        <div>
          <strong>6+</strong>
          <span>{t("Research projects")}</span>
        </div>
        <div>
          <strong>01</strong>
          <span>{t("Granted national patent")}</span>
        </div>
      </section>

      <section className="about section-shell" id="about">
        <p className="section-kicker">{t("About")}</p>
        <div className="about-grid">
          <h2>
            {t("Research at the intersection of")}{" "}
            <em>{t("intelligence, health, and people.")}</em>
          </h2>
          <div className="about-copy">
            <p>
              {t(
                "I am a postdoctoral researcher at the Department of Electrical and Information Engineering of Politecnico di Bari, and a member of SisInfLab.",
              )}
            </p>
            <p>
              {t(
                "My work connects artificial intelligence with real healthcare needs: building predictive methods, making their reasoning understandable, and designing interaction models that support informed human decisions.",
              )}
            </p>
            <a
              className="inline-link"
              href="https://sisinflab.poliba.it/people/paolo-sorino/"
              rel="noreferrer"
              target="_blank"
            >
              {t("View institutional profile")}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="projects section-shell" id="projects">
        <div className="section-heading projects-heading">
          <div>
            <p className="section-kicker">{t("Research projects")}</p>
            <h2>{t("From methods to deployed research.")}</h2>
          </div>
          <div>
            <p>
              {t(
                "I contribute to interdisciplinary projects where AI must remain scientifically rigorous, understandable, and useful to the people who rely on it.",
              )}
            </p>
            <p className="project-note">
              {t(
                "Additional collaborations include LIFE, MISTRAL, and DEMETRA.",
              )}
            </p>
          </div>
        </div>

        <div className="projects-list">
          {projects.map((project) => (
            <article className="project-row" key={project.name}>
              <div className="project-meta">
                <span>{t(project.year)}</span>
                <small>{t(project.accent)}</small>
              </div>
              <div>
                <h3>{project.name}</h3>
                <p className="project-role">{t(project.role)}</p>
              </div>
              <p className="project-description">{t(project.description)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="publications" id="publications">
        <div className="section-shell">
          <div className="publications-topline">
            <div>
              <p className="section-kicker">{t("Selected publications")}</p>
              <h2>{t("Research, made readable.")}</h2>
            </div>
            <Link
              className="button button-light"
              href="/publications"
            >
              {t("Complete publication list")}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="publication-list">
            {selectedPublications.map((publication) => (
              <a
                className="publication-row"
                href={publication.href}
                key={publication.title}
                rel="noreferrer"
                target="_blank"
              >
                <span className="publication-year">{publication.year}</span>
                <div className="publication-main">
                  <span>{t(publication.type)}</span>
                  <h3>{publication.title}</h3>
                  <p>{publication.venue}</p>
                </div>
                <div className="publication-focus">
                  <span>{t(publication.focus)}</span>
                  <strong aria-hidden="true">↗</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="teaching section-shell" id="teaching">
        <div className="teaching-intro">
          <p className="section-kicker">{t("Teaching & supervision")}</p>
          <h2>
            {t("Making complex ideas")} <em>{t("work in practice.")}</em>
          </h2>
          <p>
            {t(
              "Teaching connects my research to the next generation of engineers: from machine learning foundations to software design and applied artificial intelligence.",
            )}
          </p>
        </div>

        <div className="teaching-list">
          {teaching.map((item) => (
            <article key={`${item.period}-${item.course}`}>
              <span>{item.period}</span>
              <div>
                <p>{t(item.role)}</p>
                <h3>{t(item.course)}</h3>
                <small>{t(item.context)}</small>
              </div>
            </article>
          ))}
          <div className="teaching-stats">
            <div>
              <strong>200+</strong>
              <span>{t("Hours of specialist training")}</span>
            </div>
            <div>
              <strong>25+</strong>
              <span>
                {t("Bachelor’s and Master’s theses supervised")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="service">
        <div className="section-shell service-grid">
          <div>
            <p className="section-kicker">{t("Academic service")}</p>
            <h2>{t("Contributing beyond publications.")}</h2>
          </div>
          <div className="service-items">
            <article className="service-item-highlight">
              <span>
                {t("Editorial board")} · {t("2026—present")}
              </span>
              <h3>{t("Associate Editor")}</h3>
              <p>
                {t(
                  "IEEE Journal of Biomedical and Health Informatics (J-BHI) · Public Health Informatics Section · Q1 journal.",
                )}
              </p>
            </article>
            <article>
              <span>{t("Editorial")}</span>
              <h3>{t("Guest Editor")}</h3>
              <p>
                Sensors Special Issue on Advances in Sensorized AI-Driven
                Intelligent Systems in Healthcare and Beyond.
              </p>
            </article>
            <article>
              <span>{t("Research community")}</span>
              <h3>{t("International engagement")}</h3>
              <p>
                {t(
                  "Invited lectures, workshop organization, programme committees, and session leadership across AI, HMI, and healthcare research.",
                )}
              </p>
            </article>
            <article>
              <span>{t("Innovation")}</span>
              <h3>{t("Granted patent")}</h3>
              <p>
                {t(
                  "Machine-learning method for validating NAFLD diagnosis without imaging technologies.",
                )}
              </p>
            </article>
          </div>

          <div className="invited-talks">
            <div className="invited-talks-intro">
              <p className="section-kicker">
                {t("Invited talks & lectures")}
              </p>
              <p>
                {t(
                  "International invitations spanning explainable healthcare AI, human–machine systems, and brain–computer interaction.",
                )}
              </p>
            </div>

            <div className="invited-talks-list">
              {invitedTalks.map((talk) => (
                <article
                  className="invited-talk"
                  key={`${talk.year}-${talk.title}`}
                >
                  <span className="invited-talk-year">{talk.year}</span>
                  <div>
                    <p className="invited-talk-event">{talk.event}</p>
                    <h3>{talk.title}</h3>
                    <p className="invited-talk-context">
                      {t(talk.context)}
                    </p>
                  </div>
                  {talk.href ? (
                    <a
                      className="invited-talk-link"
                      href={talk.href}
                      aria-label={
                        language === "it"
                          ? `Apri il sito web di ${talk.event}`
                          : `Open the ${talk.event} website`
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
        <p className="section-kicker">{t("Let’s connect")}</p>
        <div className="contact-main">
          <h2>
            {t("Interested in explainable,")}
            <br />
            {t("human-centred")} <em>{t("healthcare AI?")}</em>
          </h2>
          <div>
            <p>
              {t(
                "I am open to research collaborations, invited talks, and projects that bring transparent AI into meaningful real-world settings.",
              )}
            </p>
            <a className="contact-email" href="mailto:paolo.sorino@poliba.it">
              paolo.sorino@poliba.it <span aria-hidden="true">↗</span>
            </a>
            <a
              className="button button-primary cv-button"
              href={publicAsset("/Paolo_Sorino_CV_2026.pdf")}
              download
            >
              {t("Download full CV")} <span aria-hidden="true">↓</span>
            </a>
            <p className="cv-meta">
              {t("Full academic CV · updated July 2026 · PDF")}
            </p>
          </div>
        </div>

        <footer className="site-footer">
          <div>
            <span className="brand-mark" aria-hidden="true">
              PS
            </span>
            <p>
              Paolo Sorino, PhD
              <small>Politecnico di Bari · SisInfLab</small>
            </p>
          </div>
          <div className="footer-links">
            {profileLinks.map((profile) => (
              <ProfileLink key={profile.label} profile={profile} />
            ))}
          </div>
          <p className="copyright">© 2026 Paolo Sorino</p>
        </footer>
      </section>
    </main>
  );
}
