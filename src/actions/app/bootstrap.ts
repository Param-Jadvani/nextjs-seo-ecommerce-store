'use server';

import { getUserFromCookie } from '@/actions/auth/auth';
import { getUserCart } from '@/actions/cart/cart';
import { getOrders } from '@/actions/order/order';
import { CartItem } from '@/types/cart';
import { OrderItem } from '@/types/order';
import { UserType } from '@/types/user';

export interface BootstrapAppState {
  user: UserType | null;
  cart: CartItem[];
  orders: OrderItem[];
}

export async function bootstrapAppState(): Promise<BootstrapAppState> {
  const [user, cartResult, ordersResult] = await Promise.all([
    getUserFromCookie(),
    getUserCart(),
    getOrders(),
  ]);

  return {
    user,
    cart: cartResult.success && cartResult.cart ? cartResult.cart : [],
    orders: ordersResult.success && ordersResult.orders ? ordersResult.orders : [],
  };
}
