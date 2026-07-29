const DEFAULT_SITE_URL = 'https://nextjs-seo-ecommerce-store.vercel.app';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEFAULT_SITE_URL);

export const SITE_URL_OBJECT = new URL(SITE_URL);

export const SITE_NAME = 'NextJs SEO E-Commerce Store';

export const DEFAULT_OG_IMAGE = '/og-image.jpg';

export const DEFAULT_DESCRIPTION =
  'Discover our curated collection of products for every need at NextJs SEO E-Commerce Store.';

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
