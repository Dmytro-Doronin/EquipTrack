'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';

import { getMe } from '@/api/auth/auth';
import { useAuthStore } from '@/stores/auth.store';

export function AuthBootstrap({ children }: PropsWithChildren) {
    const hasRun = useRef(false);
    const status = useAuthStore((state) => state.status);

    useEffect(() => {
        if (hasRun.current) {
            return;
        }

        hasRun.current = true;

        async function bootstrapAuth() {
            const { setStatus, setUser, clearAuth } = useAuthStore.getState();

            setStatus('checking');

            try {
                const user = await getMe();
                setUser(user);
            } catch {
                clearAuth();
            }
        }

        void bootstrapAuth();
    }, []);

    if (status === 'checking') {
        return <div>Loading...</div>;
    }

    return children;
}
