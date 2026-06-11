type AuthErrorResult = {
    errors?: Record<string, string[] | undefined>;
    message?: string;
};

export const getAuthErrorMessage = (
    result: AuthErrorResult,
    fallbackMessage = 'Something went wrong',
) => {
    if (result.errors) {
        for (const messages of Object.values(result.errors)) {
            if (messages?.[0]) {
                return messages[0];
            }
        }
    }

    return result.message ?? fallbackMessage;
};
