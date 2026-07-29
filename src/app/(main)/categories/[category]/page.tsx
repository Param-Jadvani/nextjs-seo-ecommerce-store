import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import ProductCard from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/badge';
import { openGraph } from '@/utils/openGraphMeta';
import { twitter } from '@/utils/twitterMeta';
import { SITE_NAME, SITE_URL_OBJECT } from '@/utils/seo';
import {
  categoryFromSlug,
  categoryPath,
  categorySlug,
  getCategories,
  loadProductCatalog,
} from '@/lib/catalog';

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: categorySlug(category),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const slug = (await params).category;
  const categories = await getCategories();
  const matchedCategory = categoryFromSlug(slug, categories);

  if (!matchedCategory) {
    return {
      title: `Category Not Found - ${SITE_NAME}`,
      description: 'The requested category could not be found.',
      alternates: {
        canonical: '/products',
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const formattedCategory = matchedCategory.charAt(0).toUpperCase() + matchedCategory.slice(1);
  const canonical = categoryPath(matchedCategory);
  const description = `Browse ${formattedCategory.toLowerCase()} products at ${SITE_NAME}.`;

  return {
    title: `${formattedCategory} - Products | ${SITE_NAME}`,
    description,
    alternates: {
      canonical,
      languages: {
        'en-US': new URL(canonical, SITE_URL_OBJECT).toString(),
      },
    },
    openGraph: {
      ...openGraph,
      title: `${formattedCategory} - ${SITE_NAME}`,
      description,
      url: canonical,
    },
    twitter: {
      ...twitter,
      title: `${formattedCategory} - ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const slug = (await params).category;
  const [categories, products] = await Promise.all([getCategories(), loadProductCatalog()]);
  const matchedCategory = categoryFromSlug(slug, categories);

  if (!matchedCategory) {
    notFound();
  }

  const filteredProducts = products.filter((product) => product.category === matchedCategory);
  const formattedCategory = matchedCategory.charAt(0).toUpperCase() + matchedCategory.slice(1);
  const canonical = categoryPath(matchedCategory);
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: new URL('/', SITE_URL_OBJECT).toString(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: new URL('/products', SITE_URL_OBJECT).toString(),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: formattedCategory,
        item: new URL(canonical, SITE_URL_OBJECT).toString(),
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Script
        id={`category-breadcrumb-structured-data-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="mb-8 rounded-[2rem] border border-border/60 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-6 shadow-lg md:p-8">
        <div className="mb-5 space-y-3">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/products" className="hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">{formattedCategory}</li>
            </ol>
          </nav>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                Category spotlight
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{formattedCategory}</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Explore our curated {formattedCategory.toLowerCase()} collection with hand-picked
                products, fast shipping, and a cleaner shopping experience.
              </p>
            </div>
            <Badge variant="outline" className="h-fit rounded-full px-4 py-2">
              {filteredProducts.length} products
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
