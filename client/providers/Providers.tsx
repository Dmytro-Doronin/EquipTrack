'use client';

import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

import { AuthBootstrap } from '@/components/auth/authBootstrap/AuthBootstrap';
import { ModalHost } from '@/components/modalHost/modalHost';
import { NotificationCenter } from '@/components/notificationCenter/NotificationCenter';
import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider';

export const Providers = ({ children }: PropsWithChildren) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <GoogleAuthProvider>
                <NotificationCenter />
                <ModalHost />
                <AuthBootstrap>{children}</AuthBootstrap>
            </GoogleAuthProvider>
        </QueryClientProvider>
    );
};
