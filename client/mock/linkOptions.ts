import { privateRoutesVariables } from '@/mock/routerVariables';
import { LinkOption } from '@/types/linkOptionTypes';

export const linkOptions: LinkOption[] = [
    {
        id: '1',
        title: 'Dashboard',
        link: privateRoutesVariables.dashboard,
    },
    {
        id: '2',
        title: 'Log out',
    },
];
