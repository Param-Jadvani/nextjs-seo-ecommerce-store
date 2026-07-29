'use client';

import { useEffect } from 'react';

import userStore from '@/store/userStore';
import userCartStore from '@/store/userCartStore';
import userOrderStore from '@/store/userOrderStore';

import { CartItem } from '@/types/cart';
import { OrderItem } from '@/types/order';
import { UserType } from '@/types/user';

interface AppInitializerProps {
  user: UserType | null;
  cart: CartItem[];
  orders: OrderItem[];
}

export default function AppInitializer({ user, cart, orders }: AppInitializerProps) {
  useEffect(() => {
    const userState = userStore.getState();
    const cartState = userCartStore.getState();
    const orderState = userOrderStore.getState();

    if (user) userState.setUser(user);
    else userState.logout();

    cartState.setCart(cart);
    orderState.setOrders(orders);
  }, [user, cart, orders]);
  return null;
}
