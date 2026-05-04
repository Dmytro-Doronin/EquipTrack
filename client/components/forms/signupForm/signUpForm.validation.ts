import { z } from 'zod';

import { passwordRules } from '@/components/forms/passwordRules';

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const avatarSchema = z
    .custom<File | null>((file) => {
        if (file === null) {
            return true;
        }

        return typeof File !== 'undefined' && file instanceof File && file.size > 0;
    }, 'Invalid avatar')
    .refine((file) => {
        if (file === null) {
            return true;
        }

        return file.size <= MAX_AVATAR_SIZE;
    }, 'Avatar must be less than 5MB')
    .refine((file) => {
        if (file === null) {
            return true;
        }

        return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, 'Only JPEG, PNG and WEBP images are allowed');

export const passwordSchema = z
    .string()
    .min(passwordRules.minLength, {
        error: `Password must be at least ${passwordRules.minLength} characters`,
    })
    .refine(passwordRules.hasUppercase, {
        error: 'Password must contain an uppercase letter',
    })
    .refine(passwordRules.hasNumber, {
        error: 'Password must contain a number',
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
