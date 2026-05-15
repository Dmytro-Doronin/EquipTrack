'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';

import { refreshSession } from '@/api/apiClient';
import { Loader } from '@/components/loader/Loader';
import { useAuthStore } from '@/stores/auth.store';
import { hasAuthHint } from '@/utils/authHint';

export const AuthBootstrap = ({ children }: PropsWithChildren) => {
    const hasRun = useRef(false);
    const status = useAuthStore((state) => state.status);

    useEffect(() => {
        if (hasRun.current) {
            return;
        }

        hasRun.current = true;

        async function bootstrapAuth() {
            const { setStatus, clearAuth } = useAuthStore.getState();

            if (!hasAuthHint()) {
                clearAuth();
                return;
            }

            setStatus('checking');

            const session = await refreshSession();

            if (!session) {
                clearAuth();
            }
        }

        void bootstrapAuth();
    }, []);

    if (status === 'checking') {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    return children;
};
