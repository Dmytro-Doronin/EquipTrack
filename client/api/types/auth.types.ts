export type User = {
    id: number;
    login: string;
    email: string;
    avatarUrl: string | null;
    role: string;
};

export type AuthApiResponse<TData = unknown> = {
    success: boolean;
    data?: TData;
    errors?: Record<string, string[]>;
    message?: string;
};

export type AuthApiErrorResponse = {
    detail?: {
        errors?: Record<string, string[]>;
        message?: string;
    };
};

export type SignUpType = {
    login: string;
    password: string;
    email: string;
    confirmPassword: string;
};

export type SignInType = {
    email: string;
    password: string;
};

export type ForgotPasswordType = {
    email: string;
};

export type ResetPasswordType = {
    token: string;
    password: string;
    confirmPassword: string;
};

export type AuthMessageResponse = {
    success: boolean;
    errors?: Record<string, string[]>;
    message: string;
};

export type GetMeResponse = {
    success: boolean;
    data: {
        id: number;
        login: string;
        email: string;
        avatarUrl: string | null;
        role: string;
    };
};
export type AuthSessionResponse = {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
};

export type RefreshResponse = AuthSessionResponse;
