'use client';

import { useMutation } from '@tanstack/react-query';

import { signupStart } from '@/api/auth/authApi';

export function useSignupStartMutation() {
    return useMutation({
        mutationFn: signupStart,
    });
}
