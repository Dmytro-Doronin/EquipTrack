'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { forgotPasswordStart } from '@/api/auth/authApi';
import { getAuthErrorMessage } from '@/hooks/mutations/getAuthErrorMessage';
import { useForgotPasswordFlowStore } from '@/stores/forgotPasswordFlow.store';

type ForgotPasswordStartMutationVariables = {
    email: string;
    formData: FormData;
};

export function useForgotPasswordStartMutation() {
    const router = useRouter();
    const setEmail = useForgotPasswordFlowStore((state) => state.setEmail);

    return useMutation({
        mutationFn: async ({ formData }: ForgotPasswordStartMutationVariables) => {
            const result = await forgotPasswordStart(formData);

            if (!result.success) {
                throw new Error(getAuthErrorMessage(result));
            }

            return result;
        },
        onSuccess: (_result, variables) => {
            setEmail(variables.email);
            router.push('/forgot-password/success-send-link');
        },
    });
}
