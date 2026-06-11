export type BackendValidationErrorResponse = {
    detail?: {
        errors?: Record<string, string[]>;
    };
};
