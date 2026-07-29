import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Complete scientific publication list of Paolo Sorino, with verified DOI and official publisher links. Elenco completo delle pubblicazioni scientifiche con DOI verificati.",
};

export default function PublicationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
