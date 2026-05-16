'use server';

import { cookies } from 'next/headers';

import { FastApiErrorResponse, User } from '@/actions/types';
import { apiURL } from '@/api/variables';
import { parseCookieHeader } from '@/utils/parseCookieHeader';

type SignInActionData = {
    accessToken: string;
    user: User;
};

export type SignInActionState = {
    success: boolean;
    data?: SignInActionData;
    errors?: Record<string, string[]>;
    message?: string;
};

type SignInSuccessResponse = {
    data?: {
        accessToken?: string;
        user: User;
    };
};

export const signInAction = async (formData: FormData): Promise<SignInActionState> => {
    const response = await fetch(`${apiURL}/auth/signin`, {
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
    const user = data?.data?.user;
    if (!user) {
        return {
            success: false,
            message: 'User does not exist',
        };
    }

    const accessToken = data?.data?.accessToken;
    if (!accessToken) {
        return {
            success: false,
            message: 'Access token does not exist',
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
        data: {
            accessToken,
            user,
        },
    };
};
