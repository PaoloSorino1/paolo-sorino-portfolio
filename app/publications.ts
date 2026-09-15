import publicationContent from "../content/publications.json";

export type PublicationCategory = "journal" | "conference";

export type Publication = {
  year: string;
  category: PublicationCategory;
  title: string;
  venue: string;
  doi?: string;
  href: string;
  featured?: boolean;
  focusEn?: string;
  focusIt?: string;
};

const publications = publicationContent.publications as Publication[];

const byYearDescending = (left: Publication, right: Publication) =>
  Number.parseInt(right.year, 10) - Number.parseInt(left.year, 10);

export const allPublications = [...publications].sort(byYearDescending);

export const journalPublications = allPublications.filter(
  (publication) => publication.category === "journal",
);

export const conferencePublications = allPublications.filter(
  (publication) => publication.category === "conference",
);

export const featuredPublications = allPublications.filter(
  (publication) => publication.featured,
).slice(0, 4);

export const publicationCount = allPublications.length;

const publicationYears = allPublications
  .map((publication) => Number.parseInt(publication.year, 10))
  .filter(Number.isFinite);

export const publicationPeriod = publicationYears.length
  ? `${Math.min(...publicationYears)}—${Math.max(...publicationYears)}`
  : "—";
