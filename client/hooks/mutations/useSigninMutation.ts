'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { signin } from '@/api/auth/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { setAuthHint } from '@/utils/authHint';

export function useSigninMutation() {
    const router = useRouter();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: signin,
        onSuccess: (result) => {
            if (!result.success) {
                return;
            }

            if (result.data?.user && result.data?.accessToken) {
                setUser(result.data.user);
                setAccessToken(result.data.accessToken);
                setAuthHint();
            }

            router.push('/dashboard');
        },
    });
}
