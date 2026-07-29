import { CartItem } from "@/types/cart";
import { create } from "zustand";

interface CartStore {
    cart: CartItem[];
    setCart: (cart: CartItem[]) => void;
    addToCart: (cartData: CartItem) => void;
    removeFromCart: (cartId: string) => void;
    clearCart: () => void;
    updateCart: (cartData: CartItem) => void;
}

const userCartStore = create<CartStore>((set) => ({
    cart: [],
    setCart: (cart: CartItem[]) => {
        set(() => ({ cart }));
    },
    addToCart: (cartData: CartItem) => {
        set((state) => {
            const existingItem = state.cart.find((item) => item.productId === cartData.productId);
            if (existingItem) {
                const updatedQuantity = cartData.quantity;
                const updatedTotal = existingItem.price * updatedQuantity;
                return {
                    cart: state.cart.map((item) =>
                        item.productId === cartData.productId
                            ? {
                                  ...item,
                                  quantity: updatedQuantity,
                                  total: updatedTotal,
                              }
                            : item
                    ),
                };
            }
            return {
                cart: [...state.cart, cartData],
            };
        });
    },
    removeFromCart: (cartId: string) => {
        set((state) => ({
            cart: state.cart.filter((item) => item._id !== cartId),
        }));
    },
    clearCart: () => {
        set(() => ({ cart: [] }));
    },
    updateCart: (cartData: CartItem) => {
        set((state) => ({
            cart: state.cart.map((item) => (item._id === cartData._id ? cartData : item)),
        }));
    },
}));

export default userCartStore;
