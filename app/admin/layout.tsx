import type { Metadata } from "next";
import { SITE_URL } from "../site-config";

export const metadata: Metadata = {
  title: "Content Studio",
  description: "GitHub-authorized content management for this research portfolio.",
  alternates: {
    canonical: `${SITE_URL}/admin/`,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
