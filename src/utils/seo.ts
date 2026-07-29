const DEFAULT_SITE_URL = 'http://localhost:3000';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

export const SITE_URL_OBJECT = new URL(SITE_URL);

export const SITE_NAME = 'NextJs SEO E-Commerce Shop';

export const DEFAULT_OG_IMAGE = '/og-image.jpg';

export const DEFAULT_DESCRIPTION =
  'Discover our curated collection of products for every need at NextJs SEO E-Commerce Shop.';

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
