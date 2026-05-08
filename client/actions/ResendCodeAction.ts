'use server';

import { actionState, FastApiErrorResponse } from '@/actions/types';

export const codeResendAction = async (email: string): Promise<actionState> => {
    const formData = new FormData();
    formData.append('email', email);

    const response = await fetch('http://localhost:8000/api/auth/signup/resend-code', {
        method: 'POST',
        body: formData,
    });

    const data = (await response.json().catch(() => null)) as FastApiErrorResponse | null;

    if (!response.ok) {
        return {
            success: false,
            errors: 'detail' in (data ?? {}) ? data?.detail?.errors : undefined,
            message:
                'detail' in (data ?? {})
                    ? (data?.detail?.message ?? 'Resend code failed')
                    : 'Resend code failed',
        };
    }

    return {
        success: true,
    };
};
