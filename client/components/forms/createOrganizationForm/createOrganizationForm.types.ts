import { z } from 'zod';

import { createOrganizationSchema } from '@/components/forms/createOrganizationForm/createOrganizationForm.validation';

export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;
