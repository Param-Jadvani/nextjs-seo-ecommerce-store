'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, CreditCard, Check } from 'lucide-react';
import userCartStore from '@/store/userCartStore';
import userStore from '@/store/userStore';
import { toast } from 'sonner';
import { ShippingAddress } from '@/types/order';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import ReviewOrder from '@/components/checkout/ReviewOrder';
import OrderSummary from '@/components/checkout/OrderSummary';
import { createRazorpayOrder } from '@/actions/payment/payment';
import { createOrder } from '@/actions/order/order';
import RazorpayCheckout from '@/components/payment/RazorpayCheckout';

const initialShippingAddress: ShippingAddress = {
  fullName: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phoneNumber: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = userCartStore((s) => s);
  const { user } = userStore((s) => s);
  const [activeTab, setActiveTab] = useState('shipping');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(initialShippingAddress);
  const [razorpayData, setRazorpayData] = useState<{
    orderId: string;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: string;
    };
    items: {
      productId: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    shippingAddress: ShippingAddress;
    total: number;
  } | null>(null);

  const handleShippingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  }, []);

  const isShippingComplete = useMemo(
    () => Object.values(shippingAddress).every((value) => value.trim() !== ''),
    [shippingAddress],
  );

  const isPaymentComplete = useMemo(() => true, []);

  const handleNextStep = useCallback(() => {
    if (activeTab === 'shipping' && isShippingComplete) setActiveTab('payment');
    else if (activeTab === 'payment' && isPaymentComplete) setActiveTab('review');
  }, [activeTab, isShippingComplete, isPaymentComplete]);

  const handlePrevStep = useCallback(() => {
    if (activeTab === 'payment') setActiveTab('shipping');
    else if (activeTab === 'review') setActiveTab('payment');
  }, [activeTab]);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Authentication Error', {
        description: 'Please log in to place an order.',
      });
      router.push('/login?redirect=/checkout');
      return;
    }
    if (!isShippingComplete || !isPaymentComplete) {
      toast.warning('Incomplete Information', {
        description: 'Please complete all shipping and payment details.',
      });

      if (!isShippingComplete) setActiveTab('shipping');
      else if (!isPaymentComplete) setActiveTab('payment');
      return;
    }
    if (cart.length === 0) {
      toast.warning('Empty Cart', {
        description: 'Your cart is empty. Please add items before checking out.',
      });
      router.push('/products');
      return;
    }

    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    }));

    const calculatedTotal = total;

    try {
      setIsPlacingOrder(true);

      const razorpayResult = await createRazorpayOrder(calculatedTotal);

      if (!razorpayResult.success || !razorpayResult.order) {
        toast.error(razorpayResult.error || 'Unable to create payment');
        return;
      }

      const orderResult = await createOrder({
        items,
        shippingAddress,
        total: calculatedTotal,
        paymentInfo: {
          razorpayOrderId: razorpayResult.order.id,
          expectedAmountPaise: razorpayResult.order.amount as number,
        },
      });

      if (!orderResult.success || !orderResult.order) {
        toast.error('Unable to create order');
        return;
      }

      setRazorpayData({
        orderId: orderResult.order._id,
        razorpayOrder: razorpayResult.order as { id: string; amount: number; currency: string },
        items,
        shippingAddress,
        total: calculatedTotal,
      });
    } catch (error: unknown) {
      console.error('Checkout Error:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error('Order Failed', { description: message });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const { subtotal, shipping, tax, total } = useMemo(() => {
    const calculatedSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const calculatedShipping = calculatedSubtotal > 0 ? (calculatedSubtotal > 50 ? 0 : 5.99) : 0;
    const calculatedTax = calculatedSubtotal * 0.07;
    const calculatedTotal = calculatedSubtotal + calculatedShipping + calculatedTax;
    return {
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      tax: calculatedTax,
      total: calculatedTotal,
    };
  }, [cart]);

  if (cart.length === 0 && !isPlacingOrder) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600 mb-6">Your cart is empty. Add some products to proceed.</p>
        <Button asChild className="h-12 rounded-full bg-foreground text-background">
          <Link href="/products">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <CheckoutHeader onBackToCart={() => router.push('/cart')} />
      <h1 className="mb-6 text-3xl font-bold tracking-tight sm:mb-8 sm:text-4xl">Checkout</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 items-start">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3 overflow-hidden rounded-full">
              <TabsTrigger
                value="shipping"
                disabled={activeTab !== 'shipping' && !isShippingComplete}
                className="rounded-full text-xs sm:text-sm"
              >
                <Home size={16} className="mr-2" />
                Shipping
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                disabled={!isShippingComplete || (activeTab === 'review' && !isPaymentComplete)}
                className="rounded-full text-xs sm:text-sm"
              >
                <CreditCard size={16} className="mr-2" />
                Payment
              </TabsTrigger>
              <TabsTrigger
                value="review"
                disabled={!isShippingComplete || !isPaymentComplete}
                className="rounded-full text-xs sm:text-sm"
              >
                <Check size={16} className="mr-2" />
                Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping">
              <ShippingForm
                shippingAddress={shippingAddress}
                onShippingChange={handleShippingChange}
                onNextStep={handleNextStep}
                isShippingComplete={isShippingComplete}
              />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentForm
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                isPaymentComplete={isPaymentComplete}
              />
            </TabsContent>

            <TabsContent value="review">
              <ReviewOrder
                shippingAddress={shippingAddress}
                cart={cart}
                onPrevStep={handlePrevStep}
                onPlaceOrder={handlePlaceOrder}
                onEditShipping={() => setActiveTab('shipping')}
                isPlacingOrder={isPlacingOrder}
                total={total}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            cartLength={cart.length}
          />
        </div>
      </div>

      {razorpayData && (
        <RazorpayCheckout
          razorpayOrder={razorpayData.razorpayOrder}
          shippingAddress={razorpayData.shippingAddress}
          orderId={razorpayData.orderId}
        />
      )}
    </div>
  );
}
