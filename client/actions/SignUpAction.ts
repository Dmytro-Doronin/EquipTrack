'use server';

import { actionState } from '@/actions/types';
import { apiURL } from '@/api/variables';

export const signUpAction = async (formData: FormData): Promise<actionState> => {
    const response = await fetch(`${apiURL}/auth/signup/start`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        return {
            success: false,
            errors: data?.detail?.errors,
            message: data?.detail?.message ?? 'Sign in failed',
        };
    }

    return {
        success: true,
    };
};
