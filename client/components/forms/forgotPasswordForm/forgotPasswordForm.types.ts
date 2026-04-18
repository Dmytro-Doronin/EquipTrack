import { z } from 'zod';

import { forgotPasswordSchema } from '@/components/forms/forgotPasswordForm/forgotPasswordForm.validation';

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
