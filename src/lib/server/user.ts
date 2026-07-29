import 'server-only';

import { getUserFromCookie } from '@/actions/auth/auth';
import { getUserCart } from '@/actions/cart/cart';
import { getOrders } from '@/actions/order/order';

import { CartItem } from '@/types/cart';
import { OrderItem } from '@/types/order';
import { UserType } from '@/types/user';

export async function getCurrentUser(): Promise<UserType | null> {
  try {
    return await getUserFromCookie();
  } catch (err) {
    console.error('getCurrentUser:', err);
    return null;
  }
}

export async function getCurrentCart(): Promise<CartItem[]> {
  try {
    const result = await getUserCart();

    if (!result.success || !result.cart) {
      return [];
    }

    return result.cart;
  } catch (err) {
    console.error('getCurrentCart:', err);
    return [];
  }
}

export async function getCurrentOrders(): Promise<OrderItem[]> {
  try {
    const result = await getOrders();

    if (!result.success || !result.orders) {
      return [];
    }

    return result.orders;
  } catch (err) {
    console.error('getCurrentOrders:', err);
    return [];
  }
}
