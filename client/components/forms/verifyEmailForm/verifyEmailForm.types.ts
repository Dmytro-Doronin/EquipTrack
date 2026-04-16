import { z } from 'zod';

import { verifyEmailSchema } from '@/components/forms/verifyEmailForm/verifyEmailForm.validation';

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
