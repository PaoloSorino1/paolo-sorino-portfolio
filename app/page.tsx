import Image from "next/image";
import Link from "next/link";

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
    tags: ["XAI", "SHAP", "Clinical trust"],
  },
  {
    number: "02",
    title: "AI for Clinical Decision Support",
    description:
      "Human-centred predictive systems for risk assessment, patient stratification, and evidence-informed clinical workflows.",
    tags: ["Healthcare AI", "Predictive models", "CDSS"],
  },
  {
    number: "03",
    title: "Human–Machine Interaction",
    description:
      "Interfaces and interaction models that help people understand, question, and confidently use intelligent systems.",
    tags: ["HMI", "Human-centred AI", "Usability"],
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
    role: "Adjunct Professor",
    course: "Artificial Intelligence and Data Science",
    context:
      "2nd-Level Master’s Degree · lectures, laboratories, and tutoring",
  },
  {
    period: "2022—2025",
    role: "Assistant Lecturer",
    course: "Foundations of Machine Learning",
    context: "Master’s degree in Computer Engineering · Politecnico di Bari",
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

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Paolo Sorino — Home">
          <span className="brand-mark" aria-hidden="true">
            PS
          </span>
          <span className="brand-name">Paolo Sorino</span>
        </a>

        <nav className="main-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#research">Research</a>
          <a href="#projects">Projects</a>
          <Link href="/publications">Publications</Link>
          <a href="#teaching">Teaching</a>
        </nav>

        <a className="header-cta" href="mailto:paolo.sorino@poliba.it">
          Connect <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <div className="hero-prelude">
            <p className="eyebrow">Paolo Sorino · Research portfolio</p>
            <span className="availability">
              <i aria-hidden="true" />
              Open to research collaborations
            </span>
          </div>
          <h1>
            <span className="hero-name">Paolo Sorino,</span>
            <em>PhD</em>
          </h1>
          <p className="hero-role">
            Postdoctoral Researcher in Information Processing Systems
            <span>Politecnico di Bari</span>
          </p>
          <p className="hero-statement">
            Designing explainable, human-centred AI for healthcare.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#research">
              Explore research <span aria-hidden="true">→</span>
            </a>
            <Link className="button button-text" href="/publications">
              View publications <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="profile-links" aria-label="Academic and professional profiles">
            {profileLinks.map((profile) => (
              <ProfileLink
                key={profile.label}
                profile={profile}
                showArrow
              />
            ))}
          </div>
        </div>

        <figure className="hero-art">
          <div className="hero-art-meta" aria-hidden="true">
            <span>Research visual atlas</span>
            <span>01 — 03</span>
          </div>
          <div className="hero-art-frame">
            <Image
              alt="Editorial collage illustrating explainable artificial intelligence, clinical decision support, and human–machine interaction"
              height={933}
              priority
              sizes="(max-width: 1080px) 92vw, 48vw"
              src={publicAsset("/assets/editorial-scientific-collage-v2.webp")}
              width={1400}
            />
          </div>
          <figcaption>
            <span className="hero-art-caption-label">Research directions</span>
            <span className="hero-art-topics">
              <span>
                <small>01</small>
                XAI in healthcare
              </span>
              <span>
                <small>02</small>
                Clinical AI
              </span>
              <span>
                <small>03</small>
                Human–machine interaction
              </span>
            </span>
          </figcaption>
        </figure>
      </section>

      <section className="metrics section-shell" aria-label="Academic highlights">
        <div>
          <strong>43</strong>
          <span>Scientific publications</span>
        </div>
        <div>
          <strong>25+</strong>
          <span>Supervised theses</span>
        </div>
        <div>
          <strong>6+</strong>
          <span>Research projects</span>
        </div>
        <div>
          <strong>01</strong>
          <span>Granted national patent</span>
        </div>
      </section>

      <section className="about section-shell" id="about">
        <p className="section-kicker">About</p>
        <div className="about-grid">
          <h2>
            Research at the intersection of{" "}
            <em>intelligence, health, and people.</em>
          </h2>
          <figure className="about-portrait">
            <div className="about-portrait-frame">
              <Image
                alt="Paolo Sorino during a scientific presentation"
                height={720}
                sizes="(max-width: 560px) 220px, (max-width: 860px) 240px, 270px"
                src={publicAsset("/assets/paolo-sorino-portrait-v3.jpg")}
                width={720}
              />
              <figcaption>
                <span>Paolo Sorino</span>
                <small>Researcher · Lecturer</small>
              </figcaption>
            </div>
          </figure>
          <div className="about-copy">
            <p>
              I am a postdoctoral researcher at the Department of Electrical
              and Information Engineering of Politecnico di Bari, and a member
              of SisInfLab.
            </p>
            <p>
              My work connects artificial intelligence with real healthcare
              needs: building predictive methods, making their reasoning
              understandable, and designing interaction models that support
              informed human decisions.
            </p>
            <a
              className="inline-link"
              href="https://sisinflab.poliba.it/people/paolo-sorino/"
              rel="noreferrer"
              target="_blank"
            >
              View institutional profile <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="research section-shell" id="research">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Research focus</p>
            <h2>Three connected perspectives.</h2>
          </div>
          <p>
            From model development to explanation and interaction, each line of
            research is grounded in responsible, clinically meaningful use.
          </p>
        </div>

        <div className="research-grid">
          {primaryResearch.map((item) => (
            <article className="research-card" key={item.number}>
              <span className="card-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul aria-label={`${item.title} topics`}>
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="secondary-lines">
          <span>Secondary research lines</span>
          <p>
            Graph learning & knowledge graphs · Multimodal and privacy-aware AI
            · Brain–computer interfaces & biosignals
          </p>
        </div>
      </section>

      <section className="projects section-shell" id="projects">
        <div className="section-heading projects-heading">
          <div>
            <p className="section-kicker">Research projects</p>
            <h2>From methods to deployed research.</h2>
          </div>
          <div>
            <p>
              I contribute to interdisciplinary projects where AI must remain
              scientifically rigorous, understandable, and useful to the people
              who rely on it.
            </p>
            <p className="project-note">
              Additional collaborations include LIFE, MISTRAL, and DEMETRA.
            </p>
          </div>
        </div>

        <div className="projects-list">
          {projects.map((project) => (
            <article className="project-row" key={project.name}>
              <div className="project-meta">
                <span>{project.year}</span>
                <small>{project.accent}</small>
              </div>
              <div>
                <h3>{project.name}</h3>
                <p className="project-role">{project.role}</p>
              </div>
              <p className="project-description">{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="publications" id="publications">
        <div className="section-shell">
          <div className="publications-topline">
            <div>
              <p className="section-kicker">Selected publications</p>
              <h2>Research, made readable.</h2>
            </div>
            <Link
              className="button button-light"
              href="/publications"
            >
              Complete publication list <span aria-hidden="true">→</span>
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
                  <span>{publication.type}</span>
                  <h3>{publication.title}</h3>
                  <p>{publication.venue}</p>
                </div>
                <div className="publication-focus">
                  <span>{publication.focus}</span>
                  <strong aria-hidden="true">↗</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="teaching section-shell" id="teaching">
        <div className="teaching-intro">
          <p className="section-kicker">Teaching & supervision</p>
          <h2>
            Making complex ideas <em>work in practice.</em>
          </h2>
          <p>
            Teaching connects my research to the next generation of engineers:
            from machine learning foundations to software design and applied
            artificial intelligence.
          </p>
        </div>

        <div className="teaching-list">
          {teaching.map((item) => (
            <article key={`${item.period}-${item.course}`}>
              <span>{item.period}</span>
              <div>
                <p>{item.role}</p>
                <h3>{item.course}</h3>
                <small>{item.context}</small>
              </div>
            </article>
          ))}
          <div className="teaching-stats">
            <div>
              <strong>200+</strong>
              <span>Hours of specialist training</span>
            </div>
            <div>
              <strong>25+</strong>
              <span>Bachelor’s and Master’s theses supervised</span>
            </div>
          </div>
        </div>
      </section>

      <section className="service">
        <div className="section-shell service-grid">
          <div>
            <p className="section-kicker">Academic service</p>
            <h2>Contributing beyond publications.</h2>
          </div>
          <div className="service-items">
            <article>
              <span>Editorial</span>
              <h3>Guest Editor</h3>
              <p>
                Sensors Special Issue on Advances in Sensorized AI-Driven
                Intelligent Systems in Healthcare and Beyond.
              </p>
            </article>
            <article>
              <span>Dissemination</span>
              <h3>Invited speaker</h3>
              <p>
                ISACT 2026 on AI for BCI with Applications and WOA 2026 on AI
                and XAI in Clinical Decision Support Systems.
              </p>
            </article>
            <article>
              <span>Innovation</span>
              <h3>Granted patent</h3>
              <p>
                Machine-learning method for validating NAFLD diagnosis without
                imaging technologies.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="contact section-shell" id="contact">
        <p className="section-kicker">Let’s connect</p>
        <div className="contact-main">
          <h2>
            Interested in explainable,
            <br />
            human-centred <em>healthcare AI?</em>
          </h2>
          <div>
            <p>
              I am open to research collaborations, invited talks, and projects
              that bring transparent AI into meaningful real-world settings.
            </p>
            <a className="contact-email" href="mailto:paolo.sorino@poliba.it">
              paolo.sorino@poliba.it <span aria-hidden="true">↗</span>
            </a>
            <a
              className="button button-primary cv-button"
              href={publicAsset("/Paolo_Sorino_CV_2026.pdf")}
              download
            >
              Download full CV <span aria-hidden="true">↓</span>
            </a>
            <p className="cv-meta">Full academic CV · updated July 2026 · PDF</p>
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
