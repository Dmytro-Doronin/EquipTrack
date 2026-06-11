import type { AxiosRequestConfig } from 'axios';

import type {
    AuthApiResponse,
    AuthMessageResponse,
    AuthSessionResponse,
    ResetPasswordType,
    User,
} from '@/api/types/auth.types';

import { apiClient } from '@/api/apiClient';

type AuthRequestConfig = AxiosRequestConfig & {
    skipAuthRefresh?: boolean;
};

export const signupStart = async (formData: FormData): Promise<AuthApiResponse> => {
    const response = await apiClient.post<AuthApiResponse>('/auth/signup/start', formData);

    return response.data;
};

export const signin = async (formData: FormData): Promise<AuthSessionResponse> => {
    const response = await apiClient.post<AuthSessionResponse>('/auth/signin', formData);

    return response.data;
};

export const confirmSignupCode = async (formData: FormData): Promise<AuthApiResponse<User>> => {
    const response = await apiClient.post<AuthApiResponse<User>>('/auth/signup/confirm', formData);

    return response.data;
};

export const resendSignupCode = async (formData: FormData): Promise<AuthApiResponse<User>> => {
    const response = await apiClient.post<AuthApiResponse<User>>(
        '/auth/signup/resend-code',
        formData,
    );

    return response.data;
};

export const forgotPasswordStart = async (formData: FormData): Promise<AuthMessageResponse> => {
    const response = await apiClient.post<AuthMessageResponse>(
        '/auth/password-recovery/start',
        formData,
    );

    return response.data;
};

export const resetPasswordConfirm = async (
    payload: ResetPasswordType,
): Promise<AuthMessageResponse> => {
    const response = await apiClient.post<AuthMessageResponse>(
        '/auth/password-recovery/confirm',
        payload,
    );

    return response.data;
};

export const googleAuth = async (idToken: string): Promise<AuthSessionResponse> => {
    const response = await apiClient.post<AuthSessionResponse>('/auth/google', {
        id_token: idToken,
    });

    return response.data;
};

export const refreshToken = async (): Promise<AuthSessionResponse> => {
    const response = await apiClient.post<AuthSessionResponse>('/auth/refresh-token', undefined, {
        skipAuthRefresh: true,
    } as AuthRequestConfig);

    return response.data;
};
