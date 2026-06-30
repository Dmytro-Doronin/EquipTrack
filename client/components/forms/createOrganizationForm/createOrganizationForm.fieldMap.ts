import { Path } from 'react-hook-form';

import { CreateOrganizationFormValues } from '@/components/forms/createOrganizationForm/createOrganizationForm.types';

export const createOrganizationFieldMap = {
    name: 'name',
} satisfies Partial<Record<string, Path<CreateOrganizationFormValues>>>;
