'use client';

import { useMutation } from '@tanstack/react-query';

import { confirmSignupCode } from '@/api/auth/authApi';

export function useConfirmSignupCodeMutation() {
    return useMutation({
        mutationFn: confirmSignupCode,
    });
}
