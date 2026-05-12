export type actionState = {
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
};

export type FastApiErrorResponse = {
    detail?: {
        message?: string;
        errors?: Record<string, string[]>;
    };
};

export type User = {
    id: number;
    login: string;
    email: string;
    avatarUrl: string | null;
    role: string;
};
