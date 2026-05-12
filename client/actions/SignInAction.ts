'use server';

import { cookies } from 'next/headers';

import { actionState, FastApiErrorResponse } from '@/actions/types';
import { parseCookieHeader } from '@/utils/parseCookieHeader';

type SignInSuccessResponse = {
    data?: {
        accessToken?: string;
    };
};

export const signInAction = async (formData: FormData): Promise<actionState> => {
    const response = await fetch('http://localhost:8000/api/auth/signin', {
        method: 'POST',
        body: formData,
    });

    const data = (await response.json().catch(() => null)) as
        | (FastApiErrorResponse & SignInSuccessResponse)
        | null;

    if (!response.ok) {
        return {
            success: false,
            errors: data?.detail?.errors,
            message: data?.detail?.message ?? 'Sign in failed',
        };
    }

    const cookieStore = await cookies();

    const setCookieHeader = response.headers.getSetCookie();

    if (setCookieHeader) {
        const parsed = parseCookieHeader(setCookieHeader);
        for (const cookie of parsed) {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
    }

    return {
        success: true,
    };
};
