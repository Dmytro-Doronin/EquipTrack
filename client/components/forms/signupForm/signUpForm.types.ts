import { z } from 'zod';

import { signUpSchema } from '@/components/forms/signupForm/signUpForm.validation';

export type SignUpFormFormValues = z.infer<typeof signUpSchema>;
