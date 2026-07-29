import { UserType } from "@/types/user";
import { create } from "zustand";

interface UserStore {
    user: UserType | null;
    setUser: (user: UserType) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const userStore = create<UserStore>((set) => ({
    user: null,
    isLoggedIn: false,
    setUser: (user: UserType) => {
        set(() => ({ user, isLoggedIn: true }));
        return user;
    },
    logout: () => {
        set(() => ({ user: null, isLoggedIn: false }));
    },
}));

export default userStore;
