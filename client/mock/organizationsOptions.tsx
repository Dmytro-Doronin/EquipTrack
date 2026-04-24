import { ComponentType } from 'react';

import Create from '@/components/icons/Create';
import Join from '@/components/icons/Join';

export type OrganizationAction = 'create' | 'join';

type organizationType = {
    id: OrganizationAction;
    title: string;
    description: string;
    Icon: ComponentType;
};

export const organizationOptions: organizationType[] = [
    {
        id: 'create',
        title: 'Create',
        description: 'Create new organization',
        Icon: Create,
    },
    {
        id: 'join',
        title: 'Join',
        description: 'Join existing organization',
        Icon: Join,
    },
];
