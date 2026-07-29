import { openGraph } from '@/utils/openGraphMeta';
import { twitter } from '@/utils/twitterMeta';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL_OBJECT } from '@/utils/seo';

export const metadata: Metadata = {
  title: `Your Profile - ${SITE_NAME}`,
  description: 'View and manage your NextJs SEO E-Commerce Shop account details.',
  alternates: {
    canonical: '/profile',
    languages: {
      'en-US': new URL('/profile', SITE_URL_OBJECT).toString(),
    },
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...openGraph,
    title: `Your Profile - ${SITE_NAME}`,
    url: '/profile',
    description: 'View and manage your NextJs SEO E-Commerce Shop account details.',
  },
  twitter: {
    ...twitter,
    title: `Your Profile - ${SITE_NAME}`,
    description: 'View and manage your NextJs SEO E-Commerce Shop account details.',
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
