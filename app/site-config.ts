import { initialPortfolio } from "./portfolio-content";

export const SITE_URL = initialPortfolio.seo.siteUrl.replace(/\/+$/, "");
export const SITE_NAME = initialPortfolio.seo.siteName.en;
export const SITE_DESCRIPTION = initialPortfolio.seo.description.en;
const absoluteAsset = (path: string) => /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path}`;
export const PROFILE_IMAGE_URL = absoluteAsset(initialPortfolio.profile.portrait);
export const SOCIAL_IMAGE_URL = absoluteAsset(initialPortfolio.seo.socialImage);
export const PROFILE_LINKS = [
  initialPortfolio.profile.institutionalUrl,
  ...initialPortfolio.profile.links.map((profile) => profile.href),
].filter(Boolean).map(absoluteAsset);
