import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const sitePath = new URL(SITE_URL).pathname.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: `${sitePath}/admin/`,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
