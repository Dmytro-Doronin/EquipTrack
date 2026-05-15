import { privateRoutesVariables } from '@/mock/routerVariables';
import { LinkOption } from '@/types/linkOptionTypes';

export const linkOptions: LinkOption[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'link',
        href: privateRoutesVariables.dashboard,
    },
    {
        id: 'logout',
        title: 'Log out',
        type: 'action',
        action: 'logout',
    },
];
