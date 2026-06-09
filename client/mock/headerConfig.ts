export const HEADER_CONFIG: Record<
    string,
    {
        title: string;
        description: string;
        actionLabel?: string;
    }
> = {
    '/dashboard': {
        title: 'Dashboard',
        description: 'Overview of your organization and recent activity.',
    },
    '/dashboard/assets': {
        title: 'Assets',
        description: 'Efficiently organize and keep track of your assets.',
        actionLabel: 'Add',
    },
    '/dashboard/transfers': {
        title: 'Transfers',
        description: 'Track asset transfers between members and locations.',
    },
    '/dashboard/activity': {
        title: 'Activity',
        description: 'View recent actions and changes in your organization.',
    },
    '/dashboard/members': {
        title: 'Members',
        description: 'Manage organization members and their access.',
    },
};
