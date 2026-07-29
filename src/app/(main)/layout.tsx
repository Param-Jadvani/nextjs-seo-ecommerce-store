// /app/(main)/layout.tsx
import AppInitializer from '@/components/providers/AppInitializer';
import { openGraph } from '@/utils/openGraphMeta';
import { twitter } from '@/utils/twitterMeta';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  description:
    'Manage your account, view orders, checkout, and browse products at NextJs SEO E-Commerce Store.',
  openGraph: {
    ...openGraph,
    title: 'Manage Your NextJs SEO E-Commerce Store Account',
    description: 'Access your profile, orders, cart, and checkout.',
  },
  twitter: {
    ...twitter,
    title: 'Manage Your NextJs SEO E-Commerce Store Account',
    description: 'Access your profile, orders, cart, and checkout.',
  },
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppInitializer />
      {children}
    </div>
  );
}
