'use client';

import { useMutation } from '@tanstack/react-query';

import { resendSignupCode } from '@/api/auth/authApi';

export function useResendSignupCodeMutation() {
    return useMutation({
        mutationFn: resendSignupCode,
    });
}
