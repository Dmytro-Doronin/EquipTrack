'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { confirmSignupCode } from '@/api/auth/authApi';
import { getAuthErrorMessage } from '@/hooks/mutations/getAuthErrorMessage';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

export function useConfirmSignupCodeMutation() {
    const router = useRouter();
    const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await confirmSignupCode(formData);

            if (!result.success) {
                throw new Error(getAuthErrorMessage(result, 'Code confirmation failed'));
            }

            return result;
        },
        onSuccess: () => {
            setMaxAllowedStep('success-verification');
            router.push('/signup/success-verification');
        },
    });
}
