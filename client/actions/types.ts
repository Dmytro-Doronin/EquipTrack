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
