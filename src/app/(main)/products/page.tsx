// /app/(main)/products/page.tsx
import ProductsClient from '@/components/product/ProductClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import ProductsPageSkeleton from '@/app/(main)/products/loading';
import { ProductType } from '@/types/product';
import { openGraph } from '@/utils/openGraphMeta';
import { twitter } from '@/utils/twitterMeta';
import Link from 'next/link';
import { SITE_NAME, SITE_URL_OBJECT } from '@/utils/seo';
import { categoryFromSlug, categoryPath, getCategories, loadProductCatalog } from '@/lib/catalog';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const category = (await searchParams).q;
  let title = `All Products - ${SITE_NAME}`;
  let description = `Browse our full catalog of quality products at ${SITE_NAME}.`;
  let canonical = '/products';
  let robots = { index: true, follow: true };

  try {
    const categories = await getCategories();
    const matchedCategory = category ? categoryFromSlug(category, categories) : null;
    if (matchedCategory) {
      const formattedCategory =
        matchedCategory.charAt(0).toUpperCase() + matchedCategory.slice(1);
      title = `${formattedCategory} - Products | ${SITE_NAME}`;
      description = `Explore our collection of ${formattedCategory.toLowerCase()} products at ${SITE_NAME}.`;
      canonical = categoryPath(matchedCategory);
    } else if (category) {
      title = `Invalid Category - Products | ${SITE_NAME}`;
      description = `The category "${category}" was not found. Browse all products instead.`;
      robots = { index: false, follow: false };
    }
  } catch (error: unknown) {
    console.error('Error generating metadata:', error);
    title = `Products - ${SITE_NAME}`;
    description = `Error loading categories. Browse our products at ${SITE_NAME}.`;
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'en-US': new URL('/', SITE_URL_OBJECT).toString(),
      },
    },
    robots,
    openGraph: {
      ...openGraph,
      title: title.replace(` | ${SITE_NAME}`, ''),
      description,
      url: canonical,
    },
    twitter: {
      ...twitter,
      title: title.replace(` | ${SITE_NAME}`, ''),
      description,
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const initialCategory = (await searchParams).q || null;
  let categories: string[] = [];
  let products: ProductType[] = [];
  let fetchError: string | null = null;

  try {
    [categories, products] = await Promise.all([getCategories(), loadProductCatalog()]);
  } catch (error: unknown) {
    fetchError =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while fetching categories.';
    console.error('ProductsPage fetch error:', fetchError);
  }

  if (fetchError && categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
        <p className="text-gray-600 mb-2">
          We couldn&apos;t load the product categories at this time.
        </p>
        <p className="text-sm text-red-500 mb-6">Details: {fetchError}</p>
        <Button asChild>
          <Link href="/products">Try Again</Link>
        </Button>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsClient
        categories={categories}
        initialCategory={initialCategory}
        products={products}
      />
    </Suspense>
  );
}
