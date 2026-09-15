import type { Metadata } from "next";
import { initialPortfolio as content } from "../portfolio-content";
import {
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE_URL,
} from "../site-config";

export const metadata: Metadata = {
  title: content.seo.publicationsTitle.en,
  description: content.seo.publicationsDescription.en,
  alternates: {
    canonical: `${SITE_URL}/publications/`,
  },
  openGraph: {
    title: `${content.seo.publicationsTitle.en} | ${content.profile.name}`,
    description: content.seo.publicationsDescription.en,
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
        alt: `${content.seo.publicationsTitle.en} — ${content.profile.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${content.seo.publicationsTitle.en} | ${content.profile.name}`,
    description: content.seo.publicationsDescription.en,
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
