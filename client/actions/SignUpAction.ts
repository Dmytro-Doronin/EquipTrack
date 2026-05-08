'use server';

import { actionState } from '@/actions/types';

export const signUpAction = async (formData: FormData): Promise<actionState> => {
    const response = await fetch('http://localhost:8000/api/auth/signup/start', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        return {
            success: false,
            errors: data?.errors,
            message: data?.message ?? 'Signup failed',
        };
    }

    return {
        success: true,
    };
};
