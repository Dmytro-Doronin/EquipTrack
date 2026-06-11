'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getAuthErrorMessage } from '@/hooks/mutations/getAuthErrorMessage';
import { signin } from '@/shared/api/auth/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { setAuthHint } from '@/utils/authHint';

export function useSigninMutation() {
    const router = useRouter();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await signin(formData);

            if (!result.success) {
                throw new Error(getAuthErrorMessage(result));
            }

            return result;
        },
        onSuccess: (result) => {
            if (result.data?.user && result.data?.accessToken) {
                setUser(result.data.user);
                setAccessToken(result.data.accessToken);
                setAuthHint();
            }

            router.push('/dashboard');
        },
    });
}
