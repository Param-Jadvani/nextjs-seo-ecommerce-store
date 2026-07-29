'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShieldCheck, ShoppingCart, Star, Truck, RotateCcw } from 'lucide-react';
import QuantitySelector from '@/components/product/QuantitySelector';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/actions/cart/cart';
import userStore from '@/store/userStore';

interface ProductDetailProps {
  productData: {
    id: string;
    title: string;
    category: string;
    rating: {
      rate: number;
      count: number;
    };
    price: number;
    image: string;
    description: string;
  };
}

export default function ProductDetail({ productData }: ProductDetailProps) {
  const user = userStore((s) => s.user);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Log in first to add items to your cart');
      return;
    }

    startTransition(async () => {
      const result = await addToCart(productData.id, quantity);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message ?? 'Added to cart');
      router.push('/cart');
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-8 rounded-full border-border bg-white/80 text-foreground shadow-sm hover:bg-muted"
        onClick={() => router.push('/products')}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-border/60 bg-white shadow-lg">
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/60 flex min-h-[32rem] items-center justify-center p-8">
            <Image
              src={productData.image}
              alt={productData.title}
              className="h-full max-h-[26rem] object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
              height={420}
              width={420}
            />
          </div>
        </Card>

        <div className="space-y-6 lg:sticky lg:top-28 h-fit">
          <Card className="border-border/60 bg-white/95 shadow-lg">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {productData.category}
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    In stock
                  </Badge>
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    {productData.title}
                  </h1>
                  {productData.rating && (
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={16} className="fill-amber-500" />
                        <span className="font-medium text-foreground">
                          {productData.rating.rate}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        {productData.rating.count} verified reviews
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-3">
                  <div className="text-4xl font-semibold tracking-tight text-foreground">
                    ${productData.price.toFixed(2)}
                  </div>
                  <p className="pb-1 text-sm text-muted-foreground">Free shipping over $50</p>
                </div>
              </div>

              <Separator />

              <CardContent className="p-0">
                <p className="leading-7 text-muted-foreground">{productData.description}</p>
              </CardContent>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm">
                  <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                    <Truck size={16} />
                    Fast delivery
                  </div>
                  <p className="text-muted-foreground">Ships in 1-2 business days.</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm">
                  <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                    <RotateCcw size={16} />
                    Easy returns
                  </div>
                  <p className="text-muted-foreground">30-day return window.</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm">
                  <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                    <ShieldCheck size={16} />
                    Secure checkout
                  </div>
                  <p className="text-muted-foreground">Protected payment with Razorpay.</p>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-border bg-slate-50/70 p-4 md:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Choose quantity</p>
                    <p className="text-sm text-muted-foreground">Adjust before adding to cart.</p>
                  </div>
                  <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                </div>

                <Button
                  className="h-12 w-full rounded-full bg-foreground text-background shadow-lg shadow-black/10 hover:bg-foreground/90"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isPending}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
