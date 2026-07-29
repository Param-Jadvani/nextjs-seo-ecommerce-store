'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/product/ProductCard';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductType } from '@/types/product';
import { categoryPath } from '@/lib/catalog';
import { ChevronRight, Filter, Sparkles } from 'lucide-react';

export default function ProductsClient({
  categories,
  products,
}: {
  categories: string[];
  products: ProductType[];
  initialCategory: string | null;
}) {
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get('q');
  const router = useRouter();

  const filteredProducts = categoryFromQuery
    ? products?.filter((product) => product.category === categoryFromQuery)
    : products;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-[2rem] border border-border/60 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-6 shadow-lg md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              <Sparkles size={14} />
              Curated catalog
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Browse Catalog</h1>
              <p className="max-w-xl text-muted-foreground">
                Browse the latest picks, top-rated essentials, and category collections designed
                for a cleaner shopping flow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-border bg-white/90 px-4 py-3">
                <p className="text-2xl font-semibold">{products.length}</p>
                <p className="text-sm text-muted-foreground">Total products</p>
              </div>
              <div className="rounded-2xl border border-border bg-white/90 px-4 py-3">
                <p className="text-2xl font-semibold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
              <div className="rounded-2xl border border-border bg-white/90 px-4 py-3">
                <p className="text-2xl font-semibold">{filteredProducts.length}</p>
                <p className="text-sm text-muted-foreground">Showing now</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl rounded-3xl border border-border bg-white/90 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter size={16} />
              Filter by category
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={categoryFromQuery === null ? 'default' : 'outline'}
                className={`rounded-full ${
                  categoryFromQuery === null ? 'bg-foreground text-background' : ''
                }`}
                onClick={() => router.push('/products')}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFromQuery === category ? 'default' : 'outline'}
                  className={`rounded-full ${
                    categoryFromQuery === category ? 'bg-foreground text-background' : ''
                  }`}
                  onClick={() => router.push(categoryPath(category))}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Home</span>
          <ChevronRight size={14} />
          <span className="text-foreground">Products</span>
          {categoryFromQuery ? (
            <>
              <ChevronRight size={14} />
              <span className="text-foreground capitalize">{categoryFromQuery}</span>
            </>
          ) : null}
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          {filteredProducts.length} items
        </Badge>
      </div>

      <Separator className="mb-8" />

      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        style={{ opacity: filteredProducts ? 1 : 0.5 }}
      >
        {filteredProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
