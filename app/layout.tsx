import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import { LanguageProvider } from "./language-context";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: {
    default: "Paolo Sorino, PhD | AI, XAI & Human-Centred Healthcare",
    template: "%s | Paolo Sorino",
  },
  description:
    "Research portfolio of Paolo Sorino, Postdoctoral Researcher at Politecnico di Bari. Explainable AI, artificial intelligence for healthcare, human-machine interaction, projects, teaching, and publications.",
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
  category: "Research portfolio",
  other: {
    "codex-preview": "development",
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
    description:
      "Explainable, human-centred artificial intelligence for healthcare.",
    type: "website",
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
