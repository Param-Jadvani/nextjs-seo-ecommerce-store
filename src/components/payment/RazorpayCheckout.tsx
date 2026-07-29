'use client';

import Script from 'next/script';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { verifyRazorpayPayment } from '@/actions/payment/payment';
import { updatePaymentInfo } from '@/actions/order/order';
import userCartStore from '@/store/userCartStore';
import userOrderStore from '@/store/userOrderStore';
import { ShippingAddress } from '@/types/order';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RazorpayType = any;

declare global {
  interface Window {
    Razorpay: RazorpayType;
  }
}

interface Props {
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
  };
  orderId: string;
  shippingAddress: ShippingAddress;
}

export default function RazorpayCheckout({ razorpayOrder, orderId, shippingAddress }: Props) {
  const router = useRouter();

  const clearCart = userCartStore((state) => state.clearCart);
  const addOrder = userOrderStore((state) => state.addOrder);

  async function handleSuccess(response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const verification = await verifyRazorpayPayment(response);

    if (!verification.success) {
      toast.error(verification.error);
      return;
    }

    const order = await updatePaymentInfo(orderId, verification.paymentInfo!);

    if (!order.success) {
      toast.error(order.error);
      return;
    }

    clearCart();
    addOrder(order.order);

    toast.success('Payment successful!');

    router.replace(`/orders/${orderId}`);
  }

  function openCheckout() {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK failed to load.');
      return;
    }
    const razorpay = new window.Razorpay({
      prefill: {
        name: shippingAddress.fullName,
        contact: shippingAddress.phoneNumber,
      },
      notes: {
        customerName: shippingAddress.fullName,
      },
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Portfolio Store',
      order_id: razorpayOrder.id,
      handler: handleSuccess,
      modal: {
        ondismiss() {
          toast.warning('Payment cancelled');
        },
      },
    });

    razorpay.on(
      'payment.failed',
      (response: {
        error?: {
          description?: string;
          reason?: string;
          code?: string;
        };
      }) => {
        toast.error(response.error?.description ?? response.error?.reason ?? 'Payment failed');
      },
    );

    razorpay.open();
  }

  return <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={openCheckout} />;
}
