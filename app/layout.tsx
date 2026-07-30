import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import { LanguageProvider } from "./language-context";
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
    default: "Paolo Sorino, PhD | AI, XAI & Human-Centred Healthcare",
    template: "%s | Paolo Sorino",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Paolo Sorino",
    "Explainable AI",
    "Healthcare AI",
    "Human-Machine Interaction",
    "Clinical Decision Support",
    "Politecnico di Bari",
  ],
  authors: [{ name: "Paolo Sorino" }],
  creator: "Paolo Sorino",
  publisher: "Paolo Sorino",
  category: "Research portfolio",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  verification: {
    google: "69fLE0UGtd9lMi02uq6oHv27KFSOb6sVY2P0ZOGMyfM",
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
    title: "Paolo Sorino, PhD | Research Portfolio",
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
        alt: "Paolo Sorino research portfolio — AI and human-centred healthcare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paolo Sorino, PhD | Research Portfolio",
    description:
      "Explainable, human-centred artificial intelligence for healthcare.",
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
