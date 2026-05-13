import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/stores/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type RetryableAxiosConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
};

type RefreshResponse = {
    accessToken: string;
};

let refreshPromise: Promise<string | null> | null = null;

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
});

const refreshClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

async function refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = refreshClient
            .post<RefreshResponse>('/auth/refresh-token')
            .then((response) => {
                const newAccessToken = response.data.accessToken;

                if (!newAccessToken) {
                    throw new Error('No access token returned from refresh endpoint');
                }

                useAuthStore.getState().setAccessToken(newAccessToken);

                return newAccessToken;
            })
            .catch(() => {
                useAuthStore.getState().clearAuth();
                return null;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

apiClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableAxiosConfig | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const status = error.response?.status;

        const shouldTryRefresh =
            status === 401 && !originalRequest._retry && !originalRequest.skipAuthRefresh;

        if (!shouldTryRefresh) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
            return Promise.reject(error);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
    },
);

export { apiClient };
