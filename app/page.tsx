"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitch } from "./language-switch";
import { MailIcon } from "./mail-icon";
import { translate } from "./translations";
import { useLanguage } from "./language-context";

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
          <p className="eyebrow">Paolo Sorino, PhD</p>
          <h1>
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
            <div className="hero-science-layer" aria-hidden="true">
              <Image
                alt=""
                fill
                priority
                sizes="(max-width: 1080px) 92vw, 48vw"
                src={publicAsset("/assets/editorial-scientific-collage-v2.webp")}
              />
            </div>
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
            <svg
              aria-hidden="true"
              className="hero-knowledge-graph"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 640 600"
            >
              <g className="graph-edges">
                <path d="M250 270 105 130" />
                <path d="M250 270 100 425" />
                <path d="M250 270 355 105" />
                <path d="M250 270 510 235" />
                <path d="M250 270 190 515" />
                <path d="M250 270 430 455" />
                <path d="M105 130 100 425" />
                <path d="M105 130 355 105" />
                <path d="M100 425 430 455" />
                <path d="M100 425 510 235" />
                <path d="M355 105 190 515" />
                <path d="M355 105 430 455" />
                <path d="M510 235 430 455" />
              </g>

              <g className="graph-satellites">
                <circle cx="42" cy="265" r="5" />
                <circle cx="62" cy="72" r="3.5" />
                <circle cx="160" cy="56" r="4" />
                <circle cx="306" cy="44" r="3" />
                <circle cx="468" cy="64" r="5" />
                <circle cx="584" cy="152" r="3.5" />
                <circle cx="594" cy="354" r="4.5" />
                <circle cx="548" cy="530" r="3" />
                <circle cx="325" cy="555" r="4" />
                <circle cx="54" cy="525" r="3.5" />
              </g>

              <g className="graph-node graph-node-core">
                <circle className="graph-node-halo" cx="250" cy="270" r="55" />
                <circle cx="250" cy="270" r="39" />
                <text x="250" y="276">
                  AI
                </text>
              </g>

              <g className="graph-node">
                <circle cx="105" cy="130" r="18" />
                <text className="graph-node-code" x="105" y="134">
                  ML
                </text>
                <text className="graph-node-label" x="132" y="134">
                  {t("Machine Learning")}
                </text>
              </g>

              <g className="graph-node">
                <circle cx="100" cy="425" r="18" />
                <text className="graph-node-code" x="100" y="429">
                  H
                </text>
                <text className="graph-node-label" x="127" y="429">
                  {t("Healthcare")}
                </text>
              </g>

              <g className="graph-node">
                <circle cx="355" cy="105" r="18" />
                <text className="graph-node-code" x="355" y="109">
                  XAI
                </text>
                <text className="graph-node-label" x="382" y="109">
                  {t("Explainable AI")}
                </text>
              </g>

              <g className="graph-node">
                <circle cx="510" cy="235" r="18" />
                <text className="graph-node-code" x="510" y="239">
                  HMI
                </text>
                <text
                  className="graph-node-label graph-label-centred"
                  x="510"
                  y="270"
                >
                  {t("Human–Machine Interaction")}
                </text>
              </g>

              <g className="graph-node">
                <circle cx="190" cy="515" r="15" />
                <text className="graph-node-code" x="190" y="519">
                  KG
                </text>
                <text className="graph-node-label" x="213" y="519">
                  {t("Knowledge Graphs")}
                </text>
              </g>

              <g className="graph-node">
                <circle cx="430" cy="455" r="16" />
                <text className="graph-node-code" x="430" y="459">
                  CDS
                </text>
                <text
                  className="graph-node-label graph-label-centred"
                  x="430"
                  y="489"
                >
                  {t("Clinical Decision Support")}
                </text>
              </g>
            </svg>
            <div className="hero-data-card" aria-hidden="true">
              <small>{t("Research atlas")}</small>
              <strong>AI · ML</strong>
              <span>{t("Healthcare · XAI · HMI")}</span>
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
