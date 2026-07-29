// /app/(auth)/layout.tsx
import type { Metadata } from 'next';
import React from 'react';
import { openGraph } from '@/utils/openGraphMeta';
import { twitter } from '@/utils/twitterMeta';
import { SITE_NAME } from '@/utils/seo';

export const metadata: Metadata = {
  title: `Account Access - ${SITE_NAME}`,
  description: 'Access or create your NextJs SEO E-Commerce Store account.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    ...openGraph,
    title: `Account Access - ${SITE_NAME}`,
    description: 'Log in or sign up for your NextJs SEO E-Commerce Store account.',
    url: '/login',
  },
  twitter: {
    ...twitter,
    title: `Account Access - ${SITE_NAME}`,
    description: 'Log in or sign up for your NextJs SEO E-Commerce Store account.',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {children}
        </div>
    );
}
