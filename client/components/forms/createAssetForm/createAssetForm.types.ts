import { z } from 'zod';

import { createAssetSchema } from '@/components/forms/createAssetForm/createAssetForm.validation';

export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;
