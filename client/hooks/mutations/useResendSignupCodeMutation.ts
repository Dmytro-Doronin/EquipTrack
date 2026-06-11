'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getAuthErrorMessage } from '@/hooks/mutations/getAuthErrorMessage';
import { resendSignupCode } from '@/shared/api/auth/authApi';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

export function useResendSignupCodeMutation() {
    const router = useRouter();
    const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await resendSignupCode(formData);

            if (!result.success) {
                throw new Error(getAuthErrorMessage(result, 'Resend code failed'));
            }

            return result;
        },
        onSuccess: () => {
            setMaxAllowedStep('code');
            router.push('/signup/code');
        },
    });
}
