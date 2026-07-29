import { cache } from 'react';
import type { ProductType } from '@/types/product';

const CATEGORY_BASE = '/categories';

const FALLBACK_CATALOG: ProductType[] = [
  {
    id: '1',
    title: 'Classic Cotton Tee',
    price: 24.99,
    description: 'A soft everyday tee for relaxed, versatile styling.',
    image: 'https://placehold.co/600x800/f8f8f8/111111?text=Classic+Cotton+Tee',
    category: "men's clothing",
    rating: { rate: 4.6, count: 120 },
  },
  {
    id: '2',
    title: 'Minimal Gold Necklace',
    price: 89.99,
    description: 'A simple gold-tone necklace with a clean, modern finish.',
    image: 'https://placehold.co/600x800/f8f8f8/111111?text=Gold+Necklace',
    category: 'jewelery',
    rating: { rate: 4.8, count: 86 },
  },
  {
    id: '3',
    title: 'Wireless Headphones',
    price: 129.99,
    description: 'Comfortable over-ear headphones built for daily listening.',
    image: 'https://placehold.co/600x800/f8f8f8/111111?text=Wireless+Headphones',
    category: 'electronics',
    rating: { rate: 4.4, count: 214 },
  },
  {
    id: '4',
    title: 'Relaxed Fit Shirt',
    price: 34.99,
    description: 'An easygoing shirt with a modern fit and soft feel.',
    image: 'https://placehold.co/600x800/f8f8f8/111111?text=Relaxed+Fit+Shirt',
    category: "women's clothing",
    rating: { rate: 4.7, count: 142 },
  },
];

async function fetchCatalogFromApi(): Promise<ProductType[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch product catalog (status: ${res.status})`);
  }

  return (await res.json()) as ProductType[];
}

export const loadProductCatalog = cache(async (): Promise<ProductType[]> => {
  try {
    const catalog = await fetchCatalogFromApi();
    return catalog;
  } catch (error) {
    console.warn('Falling back to local product catalog:', error);
    return FALLBACK_CATALOG;
  }
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
