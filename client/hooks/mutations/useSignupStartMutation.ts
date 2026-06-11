'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getAuthErrorMessage } from '@/hooks/mutations/getAuthErrorMessage';
import { signupStart } from '@/shared/api/auth/authApi';
import { useSignupFlowStore } from '@/stores/signupFlow.store';

type SignupStartMutationVariables = {
    email: string;
    formData: FormData;
};

export function useSignupStartMutation() {
    const router = useRouter();
    const setEmail = useSignupFlowStore((state) => state.setEmail);
    const setMaxAllowedStep = useSignupFlowStore((state) => state.setMaxAllowedStep);

    return useMutation({
        mutationFn: async ({ formData }: SignupStartMutationVariables) => {
            const result = await signupStart(formData);

            if (!result.success) {
                throw new Error(getAuthErrorMessage(result));
            }

            return result;
        },
        onSuccess: (_result, variables) => {
            setEmail(variables.email);
            setMaxAllowedStep('code');
            router.push('/signup/code');
        },
    });
}
