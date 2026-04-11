import { z } from 'zod';

import { signInSchema } from '@/components/forms/signinForm/signInForm.validation';

export type SignInFormValues = z.infer<typeof signInSchema>;
