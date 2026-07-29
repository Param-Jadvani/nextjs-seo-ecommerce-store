import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/orders', '/profile', '/login', '/signup'],
    },
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
  };
}
