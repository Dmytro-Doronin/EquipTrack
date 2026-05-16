'use server';

import { actionState, FastApiErrorResponse } from '@/actions/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export const forgotPasswordAction = async (email: string): Promise<actionState> => {
    const response = await fetch(`${API_URL}/auth/password-recovery/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = (await response.json().catch(() => null)) as FastApiErrorResponse | null;

    if (!response.ok) {
        return {
            success: false,
            errors: data?.detail?.errors,
            message: data?.detail?.message ?? 'Password recovery failed',
        };
    }

    return {
        success: true,
    };
};
