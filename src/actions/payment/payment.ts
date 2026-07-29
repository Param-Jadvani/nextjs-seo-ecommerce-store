'use server';

import { razorpay } from '@/lib/razorpay';
import crypto from 'crypto';

export async function createRazorpayOrder(amount: number) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: true,
    });

    return {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    };
  } catch (error) {
    console.error('Create Razorpay Order:', error);

    return {
      success: false,
      error: 'Unable to create Razorpay order',
    };
  }
}

export async function verifyRazorpayPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return {
      success: false,
      error: 'Missing payment information',
    };
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return {
      success: false,
      error: 'Invalid payment signature',
    };
  }

  try {
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      return {
        success: false,
        error: `Payment status is ${payment.status}`,
      };
    }

    return {
      success: true,
      paymentInfo: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: 'Unable to verify payment',
    };
  }
}
