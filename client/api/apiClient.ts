import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { refreshSessionAction } from '@/actions/refreshSessionAction';
import { User } from '@/actions/types';
import { useAuthStore } from '@/stores/auth.store';
import { clearAuthHint } from '@/utils/authHint';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

type RetryableAxiosConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
};

type AuthSession = {
    user: User;
    accessToken: string;
};

let refreshPromise: Promise<AuthSession | null> | null = null;

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
});

export async function refreshSession(): Promise<AuthSession | null> {
    if (!refreshPromise) {
        refreshPromise = refreshSessionAction()
            .then((result) => {
                if (!result.success || !result.data) {
                    useAuthStore.getState().clearAuth();
                    clearAuthHint();

                    return null;
                }

                const session = result.data;

                useAuthStore.getState().setAuth({
                    user: session.user,
                    accessToken: session.accessToken,
                });

                return session;
            })
            .catch(() => {
                useAuthStore.getState().clearAuth();
                clearAuthHint();

                return null;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableAxiosConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const shouldTryRefresh =
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.skipAuthRefresh;

        if (!shouldTryRefresh) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const session = await refreshSession();

        if (!session) {
            return Promise.reject(error);
        }

        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;

        return apiClient(originalRequest);
    },
);
