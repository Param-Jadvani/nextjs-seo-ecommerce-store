import { cache } from 'react';
import type { ProductType } from '@/types/product';

const CATEGORY_BASE = '/categories';

export const loadProductCatalog = cache(async (): Promise<ProductType[]> => {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch product catalog (status: ${res.status})`);
  }

  return (await res.json()) as ProductType[];
});

export async function getCategories(): Promise<string[]> {
  const products = await loadProductCatalog();
  return [...new Set(products.map((product) => product.category))];
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryPath(category: string): string {
  return `${CATEGORY_BASE}/${categorySlug(category)}`;
}

export function categoryFromSlug(slug: string, categories: string[]): string | null {
  return categories.find((category) => categorySlug(category) === slug) ?? null;
}

