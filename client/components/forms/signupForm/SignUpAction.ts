'use server';

export type SignUpActionState = {
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
};

export const signUpAction = async (formData: FormData): Promise<SignUpActionState> => {
    const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        return {
            success: false,
            errors: data?.errors,
            message: data?.message ?? 'Signup failed',
        };
    }

    return {
        success: true,
    };
};
