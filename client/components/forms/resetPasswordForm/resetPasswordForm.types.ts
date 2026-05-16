import { z } from 'zod';

import { resetPasswordSchema } from '@/components/forms/resetPasswordForm/resetPasswordForm.validation';

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
