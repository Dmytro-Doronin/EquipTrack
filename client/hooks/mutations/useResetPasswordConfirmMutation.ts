'use client';

import { useMutation } from '@tanstack/react-query';

import { resetPasswordConfirm } from '@/api/auth/authApi';

export function useResetPasswordConfirmMutation() {
    return useMutation({
        mutationFn: resetPasswordConfirm,
    });
}
