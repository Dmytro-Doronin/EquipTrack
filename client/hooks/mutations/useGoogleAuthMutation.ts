'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { googleAuth } from '@/api/auth/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { setAuthHint } from '@/utils/authHint';

const getSafeRedirectPath = (nextUrl: string | null) => {
    if (!nextUrl || !nextUrl.startsWith('/') || nextUrl.startsWith('//')) {
        return '/dashboard';
    }

    return nextUrl;
};

export function useGoogleAuthMutation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);
    const notifyError = useNotificationStore((state) => state.error);

    return useMutation({
        mutationFn: async (idToken: string) => {
            const result = await googleAuth(idToken);

            if (!result.success) {
                throw new Error(
                    result.errors?.google?.[0] ?? result.message ?? 'Google sign-in failed',
                );
            }

            if (!result.data) {
                throw new Error('Google sign-in failed');
            }

            return result.data;
        },
        onSuccess: (data) => {
            setUser(data.user);
            setAccessToken(data.accessToken);
            setAuthHint();
            router.replace(getSafeRedirectPath(searchParams.get('next')));
        },
        onError: (error) => {
            notifyError(error.message || 'Google sign-in failed');
        },
    });
}
