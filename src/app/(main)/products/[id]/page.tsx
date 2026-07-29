// /app/(main)/products/[id]/page.tsx
import { Metadata } from 'next';
import ProductDetail from '@/components/product/ProductDetail';
import { Suspense } from 'react';
import ProductDetailSkeleton from '@/app/(main)/products/[id]/loading';
import Script from 'next/script';
import { twitter } from '@/utils/twitterMeta';
import { openGraph } from '@/utils/openGraphMeta';
import { ProductType } from '@/types/product';
import { SITE_NAME, SITE_URL_OBJECT } from '@/utils/seo';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Home, ShoppingBag } from 'lucide-react';

const fetchProduct = async (id: string): Promise<ProductType> => {
  if (isNaN(Number(id))) {
    throw new Error('Invalid product ID format.');
  }
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    cache: 'force-cache',
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    console.error(`Failed to fetch product ${id}: ${res.status} ${res.statusText}`);
    throw new Error(`Failed to fetch product (status: ${res.status})`);
  }
  const product = await res.json();
  if (!product || typeof product !== 'object' || !product.id || !product.title) {
    console.error('Invalid product data received:', product);
    throw new Error('Received invalid product data format.');
  }
  return product as ProductType;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const productId = (await params).id;

  try {
    const product = await fetchProduct(productId);
    const pageTitle = product.title;
    const pageDescription = product.description.substring(0, 160);
    const canonicalUrl = `/products/${productId}`;
    const imageUrl = product.image;

    return {
      title: pageTitle,
      description: pageDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        ...openGraph,
        title: `${product.title}`,
        description: pageDescription,
        url: canonicalUrl,
        type: 'website',
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
      },
      twitter: {
        ...twitter,
        card: 'summary_large_image',
        title: `${product.title} - ${SITE_NAME}`,
        description: pageDescription,
        images: [imageUrl],
      },
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Product data unavailable.';
    console.error(`Error generating metadata for product ${productId}:`, errorMessage);
    const title = 'Product Not Found';
    const description = `Details for product ID ${productId} could not be loaded. ${errorMessage}`;
    return {
      title,
      description: description,
      alternates: {
        canonical: `/products/${productId}`,
      },
      robots: {
        index: false,
      },
      openGraph: {
        ...openGraph,
        title: `${title} - ${SITE_NAME}`,
        description,
        url: `/products/${productId}`,
      },
      twitter: {
        ...twitter,
        card: 'summary',
        title: `${title} - ${SITE_NAME}`,
        description,
      },
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const productId = (await params).id;

  try {
    const product = await fetchProduct(productId);
    const canonicalUrl = `/products/${product.id}`;
    const pageDescription = product.description.substring(0, 160);
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
          name: product.title,
          item: new URL(canonicalUrl, SITE_URL_OBJECT).toString(),
        },
      ],
    };

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      image: product.image,
      description: pageDescription,
      sku: product.id.toString(),
      brand: {
        '@type': 'Brand',
        name: SITE_NAME,
      },
      offers: {
        '@type': 'Offer',
        url: new URL(`/products/${product.id}`, SITE_URL_OBJECT).toString(),
        priceCurrency: 'USD',
        price: product.price.toFixed(2),
        availability: 'https://schema.org/InStock',
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .split('T')[0],
      },
    };

    return (
      <>
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
        <Script
          id="product-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="container mx-auto px-4 pt-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              <li className="flex items-center gap-2">
                <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground">
                  <Home size={14} />
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={14} />
              </li>
              <li>
                <Link href="/products" className="inline-flex items-center gap-1 hover:text-foreground">
                  <ShoppingBag size={14} />
                  Products
                </Link>
              </li>
              <li>
                <ChevronRight size={14} />
              </li>
              <li className="text-foreground font-medium line-clamp-1">{product.title}</li>
            </ol>
          </nav>
          <Separator className="mt-4" />
        </div>
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail productData={product} />
        </Suspense>
      </>
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error(`Error rendering ProductDetailPage for ID ${productId}:`, errorMessage);
    throw error;
  }
}
