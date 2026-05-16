'use server';

import { actionState, FastApiErrorResponse } from '@/actions/types';
import { apiURL } from '@/api/variables';

type ResetPasswordActionPayload = {
    token: string;
    password: string;
    confirmPassword: string;
};

export const resetPasswordAction = async ({
    token,
    password,
    confirmPassword,
}: ResetPasswordActionPayload): Promise<actionState> => {
    const response = await fetch(`${apiURL}/auth/password-recovery/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token,
            password,
            confirmPassword,
        }),
    });

    const data = (await response.json().catch(() => null)) as FastApiErrorResponse | null;

    if (!response.ok) {
        return {
            success: false,
            errors: data?.detail?.errors,
            message: data?.detail?.message ?? 'Password reset failed',
        };
    }

    return {
        success: true,
    };
};
