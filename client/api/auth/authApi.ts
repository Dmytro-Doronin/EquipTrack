import { isAxiosError, type AxiosRequestConfig } from 'axios';

import type {
    AuthApiErrorResponse,
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

const toAuthApiResponse = <TData = unknown>(
    error: unknown,
    fallbackMessage: string,
): AuthApiResponse<TData> => {
    if (isAxiosError<AuthApiErrorResponse>(error)) {
        return {
            success: false,
            errors: error.response?.data.detail?.errors,
            message: error.response?.data.detail?.message ?? fallbackMessage,
        };
    }

    return {
        success: false,
        message: fallbackMessage,
    };
};

export const signupStart = async (formData: FormData): Promise<AuthApiResponse> => {
    try {
        const response = await apiClient.post<AuthApiResponse>('/auth/signup/start', formData);

        return response.data;
    } catch (error) {
        return toAuthApiResponse(error, 'Sign in failed');
    }
};

export const signin = async (formData: FormData): Promise<AuthSessionResponse> => {
    const response = await apiClient.post<AuthSessionResponse>('/auth/signin', formData);

    return response.data;
};

export const confirmSignupCode = async (formData: FormData): Promise<AuthApiResponse<User>> => {
    try {
        const response = await apiClient.post<AuthApiResponse<User>>(
            '/auth/signup/confirm',
            formData,
        );

        return response.data;
    } catch (error) {
        return toAuthApiResponse(error, 'Code resending failed');
    }
};

export const resendSignupCode = async (formData: FormData): Promise<AuthApiResponse<User>> => {
    try {
        const response = await apiClient.post<AuthApiResponse<User>>(
            '/auth/signup/resend-code',
            formData,
        );

        return response.data;
    } catch (error) {
        return toAuthApiResponse(error, 'Resend code failed');
    }
};

export const forgotPasswordStart = async (formData: FormData): Promise<AuthMessageResponse> => {
    try {
        const response = await apiClient.post<AuthMessageResponse>(
            '/auth/password-recovery/start',
            formData,
        );

        return response.data;
    } catch (error) {
        return toAuthApiResponse(error, 'Password recovery failed') as AuthMessageResponse;
    }
};

export const resetPasswordConfirm = async (
    payload: ResetPasswordType,
): Promise<AuthMessageResponse> => {
    try {
        const response = await apiClient.post<AuthMessageResponse>(
            '/auth/password-recovery/confirm',
            payload,
        );

        return response.data;
    } catch (error) {
        return toAuthApiResponse(error, 'Password reset failed') as AuthMessageResponse;
    }
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
