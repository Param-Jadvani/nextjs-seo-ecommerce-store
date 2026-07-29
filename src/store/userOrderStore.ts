import { OrderItem } from "@/types/order";
import { create } from "zustand";

interface OrderStore {
    orders: OrderItem[];
    setOrders: (orders: OrderItem[]) => void;
    addOrder: (order: OrderItem) => void;
    removeOrder: (orderId: string) => void;
    clearOrders: () => void;
    updateOrder: (order: OrderItem) => void;
}

const userOrderStore = create<OrderStore>((set) => ({
    orders: [],
    setOrders: (orders: OrderItem[]) => {
        set(() => ({ orders }));
    },
    addOrder: (order: OrderItem) => {
        set((state) => {
            const existingOrder = state.orders.find((item) => item._id === order._id);
            if (existingOrder) {
                return state;
            }
            return {
                orders: [...state.orders, order],
            };
        });
    },
    removeOrder: (orderId: string) => {
        set((state) => ({
            orders: state.orders.filter((item) => item._id !== orderId),
        }));
    },
    clearOrders: () => {
        set(() => ({ orders: [] }));
    },
    updateOrder: (order: OrderItem) => {
        set((state) => ({
            orders: state.orders.map((item) => (item._id === order._id ? order : item)),
        }));
    },
}));

export default userOrderStore;
