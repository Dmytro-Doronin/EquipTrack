import { User } from '@/actions/types';

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
export type RefreshResponse = {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
};
