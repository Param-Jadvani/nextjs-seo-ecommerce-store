'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { addToCart } from '@/actions/cart/cart';
import userStore from '@/store/userStore';
import { ProductType } from '@/types/product';
import userCartStore from '@/store/userCartStore';

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const user = userStore((s) => s.user);
  const addToCartStore = userCartStore((s) => s.addToCart);
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    if (!user) {
      toast.error('Please log in to add items');
      return;
    }

    startTransition(async () => {
      const result = await addToCart(product.id, 1);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      addToCartStore({
        ...result.item,
        product,
      });

      toast.success(result.message);
    });
  };

  return (
    <Card className="group overflow-hidden border-border/60 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex aspect-square h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/70 sm:h-56">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="absolute object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <Badge className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs text-background shadow-md">
          New arrival
        </Badge>
      </div>

      <CardHeader className="space-y-3 pb-3">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="min-h-12 text-base leading-6 line-clamp-2 transition-colors duration-200 group-hover:text-blue-600">
            {product.title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="flex-grow pb-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            {product.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <span>{product.rating?.rate?.toFixed?.(1) ?? '4.5'}</span>
          </div>
        </div>
        <p className="text-2xl font-semibold tracking-tight">${product.price.toFixed(2)}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          Discover curated quality pieces for everyday shopping.
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          <Button asChild variant="outline" size="sm" className="h-11 rounded-full">
            <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
          <Button
            className="h-11 rounded-full bg-foreground hover:bg-foreground/90"
            size="sm"
            onClick={handleAdd}
            disabled={isPending}
          >
            <ShoppingCart size={16} className="mr-1" />
            {isPending ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
