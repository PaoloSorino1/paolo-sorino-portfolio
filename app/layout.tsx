import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import "./visual-refresh.css";
import "./section-refresh.css";
import { LanguageProvider } from "./language-context";
import { initialPortfolio as content } from "./portfolio-content";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE_URL,
} from "./site-config";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: content.seo.title.en,
    template: `%s | ${content.profile.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: content.seo.keywords.map((keyword) => keyword.value),
  authors: [{ name: content.profile.name }],
  creator: content.profile.name,
  publisher: content.profile.name,
  category: "Research portfolio",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  verification: {
    google: content.seo.googleVerification,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        url: `${publicBasePath}/favicon-ps.svg`,
        type: "image/svg+xml",
      },
    ],
    shortcut: `${publicBasePath}/favicon-ps.svg`,
  },
  openGraph: {
    title: content.seo.title.en,
    description: SITE_DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    locale: "en_GB",
    alternateLocale: ["it_IT"],
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1400,
        height: 933,
        alt: content.seo.socialImageAlt.en,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.seo.title.en,
    description: content.seo.description.en,
    images: [SOCIAL_IMAGE_URL],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f3f5f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
