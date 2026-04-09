import { z } from 'zod';

import { passwordRules } from '@/components/forms/passwordRules';
export const passwordSchema = z
    .string()
    .min(passwordRules.minLength, {
        error: `Password must be at least ${passwordRules.minLength} characters`,
    })
    .refine(passwordRules.hasLowercase, {
        error: 'Password must contain a lowercase letter',
    })
    .refine(passwordRules.hasUppercase, {
        error: 'Password must contain an uppercase letter',
    })
    .refine(passwordRules.hasNumber, {
        error: 'Password must contain a number',
    })
    .refine(passwordRules.hasSpecial, {
        error: 'Password must contain a special character',
    });

export const signUpSchema = z
    .object({
        login: z
            .string()
            .min(3, { error: 'Login must be at least 3 characters' })
            .max(10, { error: 'Login must be shorter or equal to 10 characters' }),
        email: z.string().email({ error: 'Invalid email address' }),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        error: 'Passwords do not match',
    });
