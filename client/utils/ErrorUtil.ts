import axios from 'axios';

export const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data;

        if (Array.isArray(data?.errorsMessages) && typeof data.errorsMessages[0] === 'string') {
            return data.errorsMessages[0];
        }

        if (
            Array.isArray(data?.errorsMessages) &&
            typeof data.errorsMessages[0] === 'object' &&
            typeof data.errorsMessages[0].message === 'string'
        ) {
            return data.errorsMessages[0].message;
        }

        if (typeof data?.detail?.message === 'string') {
            return data.detail.message;
        }

        if (data?.detail?.errors && typeof data.detail.errors === 'object') {
            const firstError = Object.values(data.detail.errors)[0];

            if (Array.isArray(firstError) && typeof firstError[0] === 'string') {
                return firstError[0];
            }
        }

        if (typeof data?.message === 'string') {
            return data.message;
        }

        if (typeof data === 'string') {
            return data;
        }
    }

    if (err instanceof Error) {
        return err.message;
    }

    return 'Unknown error';
};
