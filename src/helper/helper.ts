import { getUserFromCookie } from '@/actions/auth/auth';
import { getUserCart } from '@/actions/cart/cart';
import { CartItem } from '@/types/cart';
import { ProductType } from '@/types/product';
import { UserType } from '@/types/user';

const productCache = new Map<string, ProductType>();

export async function fetchProduct(productId: string): Promise<ProductType | undefined> {
  try {
    if (productCache.has(productId)) {
      return productCache.get(productId);
    }

    const res = await fetch(`https://fakestoreapi.com/products/${productId}`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      return undefined;
    }

    const product = (await res.json()) as ProductType;

    productCache.set(productId, product);

    return product;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function fetchProducts(ids: string[]): Promise<Record<string, ProductType>> {
  const products = await Promise.all(ids.map(fetchProduct));

  return products.reduce(
    (acc, product) => {
      if (product) {
        acc[String(product.id)] = product;
      }

      return acc;
    },
    {} as Record<string, ProductType>,
  );
}

export function callbackAuth<T, Args extends unknown[]>(
  action: (user: UserType, ...args: Args) => Promise<T>,
) {
  return async (...args: Args) => {
    const user = await getUserFromCookie();

    if (!user) {
      return {
        success: false as const,
        error: 'User not authenticated',
      };
    }

    try {
      return await action(user, ...args);
    } catch (error) {
      return { success: false as const, error: (error as Error).message };
    }
  };
}

export async function getCartHelper(): Promise<CartItem[]> {
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
