import { z } from 'zod';

import { passwordSchema } from '@/components/forms/signupForm/signUpForm.validation';

export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        error: 'Passwords do not match',
    });
