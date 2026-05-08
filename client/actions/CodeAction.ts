'use server';

import { actionState, FastApiErrorResponse } from '@/actions/types';

export const codeAction = async (email: string, code: string): Promise<actionState> => {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('code', code);

    const response = await fetch('http://localhost:8000/api/auth/signup/confirm', {
        method: 'POST',
        body: formData,
    });

    const data = (await response.json().catch(() => null)) as FastApiErrorResponse | null;

    if (!response.ok) {
        return {
            success: false,
            errors: data?.detail?.errors,
            message: data?.detail?.message ?? 'Code resending failed',
        };
    }

    return {
        success: true,
    };
};
