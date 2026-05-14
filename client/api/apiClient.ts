import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { RefreshResponse } from '@/api/types/auth.types';
import { useAuthStore } from '@/stores/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

type RetryableAxiosConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
};

export const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshPromise) {
        try {
            const refreshPromise = await refreshClient.post<RefreshResponse>('/auth/refresh-token');
            const accessToken = refreshPromise.data.data.accessToken;

            useAuthStore.getState().setAccessToken(accessToken);

            return accessToken;
        } catch {
            useAuthStore.getState().clearAuth();
            return null;
        } finally {
            refreshPromise = null;
        }
    }

    return refreshPromise;
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
