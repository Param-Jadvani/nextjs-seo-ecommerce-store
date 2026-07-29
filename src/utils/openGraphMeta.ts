import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from '@/utils/seo';

export const openGraph = {
  title: SITE_NAME,
  type: 'website',
  description: DEFAULT_DESCRIPTION,
  url: '/',
  siteName: SITE_NAME,
  locale: 'en_US',
  images: [
    {
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    },
  ],
};
