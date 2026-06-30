import { z } from 'zod';

import { assetStatusValues } from '@/shared/api/types/asset.types';

export const createAssetSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { error: 'Asset name is required' })
        .max(100, { error: 'Asset name must be 100 characters or less' }),
    category: z
        .string()
        .trim()
        .min(1, { error: 'Category is required' })
        .max(100, { error: 'Category must be 100 characters or less' }),
    serialNumber: z
        .string()
        .trim()
        .min(1, { error: 'Serial number is required' })
        .max(100, { error: 'Serial number must be 100 characters or less' }),
    status: z.enum(assetStatusValues, { error: 'Status is required' }),
    assignedToUserId: z
        .string()
        .trim()
        .refine((value) => value === '' || /^[1-9]\d*$/.test(value), {
            error: 'Assigned user ID must be a positive number',
        }),
    assignedAt: z
        .string()
        .trim()
        .refine((value) => value === '' || isValidDateTime(value), {
            error: 'Assigned at must be a valid date and time',
        }),
    dueDate: z
        .string()
        .trim()
        .refine((value) => value === '' || isValidDateTime(value), {
            error: 'Due date must be a valid date and time',
        }),
    imageUrl: z
        .string()
        .trim()
        .max(500, { error: 'Image URL must be 500 characters or less' })
        .refine((value) => value === '' || isValidUrl(value), {
            error: 'Image URL must be a valid URL',
        }),
});

const isValidDateTime = (value: string) => !Number.isNaN(new Date(value).getTime());

const isValidUrl = (value: string) => {
    try {
        new URL(value);

        return true;
    } catch {
        return false;
    }
};
