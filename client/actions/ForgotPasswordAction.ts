'use server';

import { actionState, FastApiErrorResponse } from '@/actions/types';
import { apiURL } from '@/api/variables';

export const forgotPasswordAction = async (formData: FormData): Promise<actionState> => {
    const response = await fetch(`${apiURL}/auth/password-recovery/start`, {
        method: 'POST',
        body: formData,
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
