import axios from 'axios';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { BackendValidationErrorResponse } from '@/shared/api/types/type';

type SetBackendFieldErrorsOptions<TFormValues extends FieldValues> = {
    error: unknown;
    setError: UseFormSetError<TFormValues>;
    fieldMap: Partial<Record<string, Path<TFormValues>>>;
    setServerError?: (message: string) => void;
};

export const setBackendFieldErrors = <TFormValues extends FieldValues>({
    error,
    setError,
    fieldMap,
    setServerError,
}: SetBackendFieldErrorsOptions<TFormValues>) => {
    if (!axios.isAxiosError<BackendValidationErrorResponse>(error)) {
        return false;
    }

    const fieldErrors = error.response?.data?.detail?.errors;

    if (!fieldErrors) {
        return false;
    }

    let hasHandledError = false;

    Object.entries(fieldErrors).forEach(([backendField, messages]) => {
        const message = messages[0];

        if (!message) {
            return;
        }

        hasHandledError = true;

        const formField = fieldMap[backendField];

        if (formField) {
            setError(formField, {
                type: 'server',
                message,
            });

            return;
        }

        setServerError?.(message);
    });

    return hasHandledError;
};
