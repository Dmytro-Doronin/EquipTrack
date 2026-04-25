import { z } from 'zod';

export const createOrganizationSchema = z.object({
    organizationName: z.string().trim().min(1, { error: 'Organization name is required' }),
    workspaceSlug: z
        .string()
        .trim()
        .min(1, { error: 'Workspace slug is required' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            error: 'Use lowercase letters, numbers, and hyphens only',
        }),
    description: z.string().max(300, { error: 'Description must be 300 characters or less' }),
});
