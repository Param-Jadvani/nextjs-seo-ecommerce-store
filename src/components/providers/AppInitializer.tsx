'use client';

import { useEffect } from 'react';

import userStore from '@/store/userStore';
import userCartStore from '@/store/userCartStore';
import userOrderStore from '@/store/userOrderStore';
import { bootstrapAppState } from '@/actions/app/bootstrap';

export default function AppInitializer() {
  useEffect(() => {
    let isMounted = true;

    const hydrateStores = async () => {
      try {
        const { user, cart, orders } = await bootstrapAppState();

        if (!isMounted) return;

        const userState = userStore.getState();
        const cartState = userCartStore.getState();
        const orderState = userOrderStore.getState();

        if (user) userState.setUser(user);
        else userState.logout();

        cartState.setCart(cart);
        orderState.setOrders(orders);
      } catch (error) {
        console.error('Failed to hydrate app state:', error);
      }
    };

    hydrateStores();

    return () => {
      isMounted = false;
    };
  }, []);
  return null;
}
