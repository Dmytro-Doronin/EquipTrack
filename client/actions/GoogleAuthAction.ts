'use server';

import { cookies } from 'next/headers';

import { FastApiErrorResponse, User } from '@/actions/types';
import { apiURL } from '@/api/variables';
import { parseCookieHeader } from '@/utils/parseCookieHeader';

type GoogleAuthActionData = {
    accessToken: string;
    user: User;
};

export type GoogleAuthActionState = {
    success: boolean;
    data?: GoogleAuthActionData;
    errors?: Record<string, string[]>;
    message?: string;
};

type GoogleAuthSuccessResponse = {
    data?: {
        accessToken?: string;
        user?: User;
    };
};

export const googleAuthAction = async (idToken: string): Promise<GoogleAuthActionState> => {
    const response = await fetch(`${apiURL}/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_token: idToken,
        }),
    });

    const data = (await response.json().catch(() => null)) as
        | (FastApiErrorResponse & GoogleAuthSuccessResponse)
        | null;

    if (!response.ok) {
        return {
            success: false,
            errors: data?.detail?.errors,
            message: data?.detail?.message ?? 'Google sign-in failed',
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
