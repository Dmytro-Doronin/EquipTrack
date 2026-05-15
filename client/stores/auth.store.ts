import { create } from 'zustand';

import { User } from '@/actions/types';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

type AuthStore = {
    user: User | null;
    accessToken: string | null;
    status: AuthStatus;

    setAuth: (data: { user: User; accessToken: string }) => void;
    setUser: (user: User) => void;
    setAccessToken: (accessToken: string) => void;
    clearAuth: () => void;
    setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    status: 'checking',

    setAuth: ({ user, accessToken }) => {
        set({
            user,
            accessToken,
            status: 'authenticated',
        });
    },

    setUser: (user) => {
        set({
            user,
            status: 'authenticated',
        });
    },

    setAccessToken: (accessToken) => {
        set({ accessToken });
    },

    clearAuth: () => {
        set({
            user: null,
            accessToken: null,
            status: 'unauthenticated',
        });
    },

    setStatus: (status) => {
        set({ status });
    },
}));
