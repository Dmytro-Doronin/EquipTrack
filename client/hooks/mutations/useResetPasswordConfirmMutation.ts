'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { resetPasswordConfirm } from '@/api/auth/authApi';
import { getAuthErrorMessage } from '@/hooks/mutations/getAuthErrorMessage';

export function useResetPasswordConfirmMutation() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (payload: Parameters<typeof resetPasswordConfirm>[0]) => {
            const result = await resetPasswordConfirm(payload);

            if (!result.success) {
                throw new Error(getAuthErrorMessage(result));
            }

            return result;
        },
        onSuccess: () => {
            router.push('/reset-password/success');
        },
    });
}
