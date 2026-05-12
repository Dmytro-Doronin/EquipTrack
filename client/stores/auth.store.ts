import { create } from 'zustand';

import { User } from '@/actions/types';

type AuthState = {
    user: User | null;
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    setUser: (user: User | null) => void;
    clearAccessToken: () => void;
    clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,

    setUser: (user) => {
        set({ user: user });
    },

    clearUser: () => {
        set({ user: null });
    },

    setAccessToken: (token) => {
        set({ accessToken: token });
    },

    clearAccessToken: () => {
        set({ accessToken: null });
    },
}));
