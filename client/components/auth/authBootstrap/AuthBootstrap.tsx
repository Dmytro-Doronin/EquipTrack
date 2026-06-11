'use client';

import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef } from 'react';

import { refreshSession } from '@/api/apiClient';
import { Loader } from '@/components/loader/Loader';
import { protectedRoutes } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/auth.store';
import { hasAuthHint } from '@/utils/authHint';

const isProtectedPath = (pathname: string) => {
    return protectedRoutes.some((route) => pathname.startsWith(route));
};
export const AuthBootstrap = ({ children }: PropsWithChildren) => {
    const hasRun = useRef(false);
    const status = useAuthStore((state) => state.status);
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if (hasRun.current) {
            return;
        }

        hasRun.current = true;

        async function bootstrapAuth() {
            const { setStatus, clearAuth } = useAuthStore.getState();

            if (!hasAuthHint()) {
                clearAuth();

                if (isProtectedPath(pathname)) {
                    router.replace('/signin');
                }

                return;
            }

            setStatus('checking');

            const session = await refreshSession();

            if (!session) {
                clearAuth();

                if (isProtectedPath(pathname)) {
                    router.replace('/signin');
                }

                return;
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
