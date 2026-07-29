// /app/(main)/layout.tsx
import AppInitializer from '@/components/providers/AppInitializer';
import { getCurrentCart, getCurrentOrders, getCurrentUser } from '@/lib/server/user';
import { CartItem } from '@/types/cart';
import { OrderItem } from '@/types/order';
import { openGraph } from '@/utils/openGraphMeta';
import { twitter } from '@/utils/twitterMeta';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  description:
    'Manage your account, view orders, checkout, and browse products at NextJs SEO E-Commerce Shop.',
  openGraph: {
    ...openGraph,
    title: 'Manage Your NextJs SEO E-Commerce Shop Account',
    description: 'Access your profile, orders, cart, and checkout.',
  },
  twitter: {
    ...twitter,
    title: 'Manage Your NextJs SEO E-Commerce Shop Account',
    description: 'Access your profile, orders, cart, and checkout.',
  },
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  let userData = null;
  let cart: CartItem[] = [];
  let orders: OrderItem[] = [];

  try {
    [userData, cart, orders] = await Promise.all([
      getCurrentUser(),
      getCurrentCart(),
      getCurrentOrders(),
    ]);
  } catch (err) {
    console.error('Error initializing data for Home page:', err);
  }
  return (
    <div className="min-h-screen bg-background">
      <AppInitializer user={userData} cart={cart} orders={orders} />
      {children}
    </div>
  );
}
