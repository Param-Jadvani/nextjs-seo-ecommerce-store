import { openGraph } from '@/utils/openGraphMeta';
import { Metadata } from 'next';
import { SITE_NAME, SITE_URL_OBJECT } from '@/utils/seo';

export const metadata: Metadata = {
  title: `Shopping Cart - ${SITE_NAME}`,
  description: 'Review items in your shopping cart and proceed to checkout.',
  alternates: {
    canonical: '/cart',
    languages: {
      'en-US': new URL('/cart', SITE_URL_OBJECT).toString(),
    },
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...openGraph,
    title: `Shopping Cart - ${SITE_NAME}`,
    url: '/cart',
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto px-4 py-8">{children}</div>;
}
