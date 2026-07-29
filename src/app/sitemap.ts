import type { MetadataRoute } from 'next';
import { ProductType } from '@/types/product';
import { SITE_URL_OBJECT } from '@/utils/seo';
import { categoryPath } from '@/lib/catalog';

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: new URL('/', SITE_URL_OBJECT).toString(),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: new URL('/products', SITE_URL_OBJECT).toString(),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
];

async function fetchCatalog() {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch product catalog for sitemap (status: ${res.status})`);
  }

  return (await res.json()) as ProductType[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await fetchCatalog();
    const categories = [...new Set(products.map((product) => product.category))];

    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: new URL(categoryPath(category), SITE_URL_OBJECT).toString(),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: new URL(`/products/${product.id}`, SITE_URL_OBJECT).toString(),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    return [...STATIC_PAGES, ...categoryPages, ...productPages];
  } catch (error) {
    console.error('Failed to build full sitemap, falling back to static pages:', error);
    return STATIC_PAGES;
  }
}
