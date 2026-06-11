'use client';

import { useMutation } from '@tanstack/react-query';

import { forgotPasswordStart } from '@/api/auth/authApi';
import { AuthMessageResponse } from '@/api/types/auth.types';

const getForgotPasswordErrorMessage = (result: AuthMessageResponse) => {
    let fieldMessage: string | null = null;

    if (result.errors) {
        Object.values(result.errors).forEach((messages) => {
            if (!messages?.[0]) {
                return;
            }

            fieldMessage = messages[0];
        });
    }

    return fieldMessage ?? result.message ?? 'Something went wrong';
};

export function useForgotPasswordStartMutation() {
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await forgotPasswordStart(formData);

            if (!result.success) {
                throw new Error(getForgotPasswordErrorMessage(result));
            }

            return result;
        },
    });
}
