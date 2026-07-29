import { openGraph } from "@/utils/openGraphMeta";
import { Metadata } from "next";
import { SITE_NAME, SITE_URL_OBJECT } from "@/utils/seo";

export const metadata: Metadata = {
  title: `My Orders - ${SITE_NAME}`,
  description: 'View your order history and track shipments.',
  alternates: {
    canonical: '/orders',
    languages: {
      'en-US': new URL('/orders', SITE_URL_OBJECT).toString(),
    },
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...openGraph,
    title: `My Orders - ${SITE_NAME}`,
    url: '/orders',
    description: 'View your order history and track shipments.',
  },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
