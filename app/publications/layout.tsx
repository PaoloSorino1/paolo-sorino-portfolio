import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE_URL,
} from "../site-config";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Complete scientific publication list of Paolo Sorino, with verified DOI and official publisher links. Elenco completo delle pubblicazioni scientifiche con DOI verificati.",
  alternates: {
    canonical: `${SITE_URL}/publications/`,
  },
  openGraph: {
    title: "Publications | Paolo Sorino",
    description:
      "Complete scientific publication list of Paolo Sorino, with verified DOI and official publisher links.",
    type: "website",
    url: `${SITE_URL}/publications/`,
    siteName: SITE_NAME,
    locale: "en_GB",
    alternateLocale: ["it_IT"],
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1400,
        height: 933,
        alt: "Scientific publications by Paolo Sorino",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Publications | Paolo Sorino",
    description:
      "Complete scientific publication list with verified DOI and official publisher links.",
    images: [SOCIAL_IMAGE_URL],
  },
};

export default function PublicationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
