// /app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Package, ShoppingCart } from 'lucide-react';
import { Metadata } from 'next';
import { openGraph } from '@/utils/openGraphMeta';
import { twitter } from '@/utils/twitterMeta';
import { getCurrentUser } from '@/lib/server/user';
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL_OBJECT } from '@/utils/seo';
import { categoryPath } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${SITE_NAME} - Discover Quality Products`,
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: '/',
      languages: {
        'en-US': new URL('/', SITE_URL_OBJECT).toString(),
      },
    },
    openGraph: {
      ...openGraph,
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      url: '/',
    },
    twitter: {
      ...twitter,
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

export default async function Home() {
  let userData = null;
  try {
    userData = await getCurrentUser();
  } catch (err) {
    console.error('Error initializing data for Home page:', err);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-8 shadow-lg md:p-10">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                Seasonal picks
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                  Welcome{userData?.username ? `, ${userData.username}` : ''} to NextJs SEO E-Commerce Store
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                  Discover curated products, fast checkout, and a clean shopping experience built
                  for everyday buying.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-foreground text-background">
                  <Link href="/products">Explore Catalog</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/categories/electronics">Browse Categories</Link>
                </Button>
              </div>

              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white/80 p-4">
                  <p className="text-2xl font-semibold">1k+</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/80 p-4">
                  <p className="text-2xl font-semibold">4.8/5</p>
                  <p className="text-sm text-muted-foreground">Average rating</p>
                </div>
                <div className="rounded-2xl border border-border bg-white/80 p-4">
                  <p className="text-2xl font-semibold">24h</p>
                  <p className="text-sm text-muted-foreground">Order handling</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="border-border/60 bg-white/95 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <ShoppingBag size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Browse Catalog</h3>
                <p className="text-muted-foreground">Browse our full catalog of quality products.</p>
                <Button asChild className="mt-2 w-full rounded-full bg-foreground text-background">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-white/95 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                  <ShoppingCart size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Your Cart</h3>
                <p className="text-muted-foreground">Review your items and move to checkout.</p>
                <Button asChild className="mt-2 w-full rounded-full bg-foreground text-background">
                  <Link href="/cart">View Cart</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-white/95 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
                  <Package size={32} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold">Track Orders</h3>
                <p className="text-muted-foreground">View and manage your order history.</p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-2 w-full rounded-full border-border bg-white"
                >
                  <Link href="/orders">My Orders</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Categories</h2>
          <p className="text-muted-foreground">Explore our most popular collections.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Electronics' },
            { name: 'Jewelery' },
            { name: "Men's Clothing" },
            { name: "Women's Clothing" },
          ].map((category) => (
            <Link href={categoryPath(category.name)} key={category.name}>
              <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] border border-border/60 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/60 opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="relative text-center">
                  <p className="text-lg font-medium text-foreground group-hover:text-blue-600 md:text-xl">
                    {category.name}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">View collection</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-[2rem] border border-border/60 bg-foreground p-8 text-center text-background shadow-xl md:p-10">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Ready to explore?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-background/80">
            Start browsing our collection and find exactly what you need.
          </p>
          <Button asChild size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90">
            <Link href="/products">Explore Catalog</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
