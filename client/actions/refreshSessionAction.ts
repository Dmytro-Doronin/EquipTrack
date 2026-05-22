'use server';

import { cookies, headers } from 'next/headers';

import { FastApiErrorResponse, User } from '@/actions/types';
import { apiURL } from '@/api/variables';
import { parseCookieHeader } from '@/utils/parseCookieHeader';

type RefreshSessionActionData = {
    accessToken: string;
    user: User;
};

export type RefreshSessionActionState = {
    success: boolean;
    data?: RefreshSessionActionData;
    errors?: Record<string, string[]>;
    message?: string;
};

type RefreshSessionSuccessResponse = {
    data?: {
        accessToken?: string;
        user?: User;
    };
};

export const refreshSessionAction = async (): Promise<RefreshSessionActionState> => {
    const cookieStore = await cookies();
    const headersStore = await headers();

    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        return {
            success: false,
            message: 'Refresh token is missing',
        };
    }

    const response = await fetch(`${apiURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Cookie: `refresh_token=${refreshToken}`,
            'User-Agent': headersStore.get('user-agent') ?? '',
        },
        cache: 'no-store',
    });

    const data = (await response.json().catch(() => null)) as
        | (FastApiErrorResponse & RefreshSessionSuccessResponse)
        | null;

    if (!response.ok) {
        cookieStore.delete('refresh_token');

        return {
            success: false,
            errors: data?.detail?.errors,
            message: data?.detail?.message ?? 'Refresh session failed',
        };
    }

    const user = data?.data?.user;

    if (!user) {
        cookieStore.delete('refresh_token');

        return {
            success: false,
            message: 'User does not exist',
        };
    }

    const accessToken = data?.data?.accessToken;

    if (!accessToken) {
        cookieStore.delete('refresh_token');

        return {
            success: false,
            message: 'Access token does not exist',
        };
    }

    const setCookieHeader = response.headers.getSetCookie();

    if (setCookieHeader) {
        const parsed = parseCookieHeader(setCookieHeader);

        for (const cookie of parsed) {
            cookieStore.set(cookie.name, cookie.value, {
                ...cookie.options,
                path: '/',
                domain: undefined,
            });
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
