'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, Home, Package, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { logoutAction } from '@/actions/auth/auth';
import userStore from '@/store/userStore';
import userCartStore from '@/store/userCartStore';
import userOrderStore from '@/store/userOrderStore';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isLoggedIn } = userStore((s) => s);
  const cartItems = new Set(userCartStore((s) => s.cart));
  const orders = userOrderStore((s) => s.orders);
  const pathname = usePathname();

  const hiddenRoutes = ['/login', '/signup'];

  const logoutHandler = async () => {
    try {
      toast.promise(
        (async () => {
          const result = await logoutAction();
          if (result.error) throw new Error(result.error);
          return result;
        })(),
        {
          loading: 'Logging out...',
          success: 'Logged out successfully!',
          error: (err) => err.message,
        },
      );
      logout();
      router.push('/login');
    } catch (error: unknown) {
      if (error instanceof Error)
        toast('Error', {
          description: error.message || 'Something went wrong',
        });
    }
  };

  const getAvatarLetter = () => {
    return user?.username?.charAt(0).toUpperCase() || '?';
  };

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-border/60 bg-white/85 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm"
            >
              NextJs SEO E-Commerce Store
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Home size={16} />
                Home
              </span>
            </Link>

            <Link
              href="/products"
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                pathname.includes('/products')
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Package size={16} />
                Products
              </span>
            </Link>

            <Link
              href="/cart"
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/cart'
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <span className="relative">
                  <ShoppingCart size={16} />
                {cartItems.size > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                    {cartItems.size}
                  </span>
                )}
                </span>
                Cart
              </span>
            </Link>

            {orders.length > 0 && (
              <Link
                href="/orders"
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/orders'
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Package size={16} />
                  Orders
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-foreground text-background hover:bg-foreground/90"
                  >
                    {getAvatarLetter()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full text-left">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {orders.length > 0 && (
                    <DropdownMenuItem>
                      <Link href="/orders" className="w-full text-left">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 md:hidden">
            <Link
              href="/"
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium ${
                pathname === '/' ? 'bg-foreground text-background' : 'border border-border bg-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium ${
                pathname.includes('/products')
                  ? 'bg-foreground text-background'
                  : 'border border-border bg-white'
              }`}
            >
              Products
            </Link>
            <Link
              href="/cart"
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium ${
                pathname === '/cart'
                  ? 'bg-foreground text-background'
                  : 'border border-border bg-white'
              }`}
            >
              Cart
            </Link>
            {orders.length > 0 && (
              <Link
                href="/orders"
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium ${
                  pathname === '/orders'
                    ? 'bg-foreground text-background'
                    : 'border border-border bg-white'
                }`}
              >
                Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
