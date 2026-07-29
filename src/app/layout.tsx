// /app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Navbar from '@/components/navbar/Navbar';
import { openGraph } from '@/utils/openGraphMeta';
import { twitter } from '@/utils/twitterMeta';
import { SITE_URL_OBJECT, SITE_NAME, DEFAULT_DESCRIPTION } from '@/utils/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: SITE_URL_OBJECT,
  title: {
    default: `${SITE_NAME} - Your Online Store`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  generator: 'Next.js',
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
    languages: {
      'en-US': new URL('/', SITE_URL_OBJECT).toString(),
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph,
  twitter,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Toaster position="top-right" duration={2500} />
      </body>
    </html>
  );
}
