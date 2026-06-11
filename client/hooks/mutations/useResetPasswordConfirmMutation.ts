'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getAuthErrorMessage } from '@/hooks/mutations/getAuthErrorMessage';
import { resetPasswordConfirm } from '@/shared/api/auth/authApi';

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
