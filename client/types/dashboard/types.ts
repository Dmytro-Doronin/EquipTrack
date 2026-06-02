export type DashboardContext = {
    user: {
        id: number;
        login: string;
        email: string;
        avatarUrl?: string | null;
        role?: string;
    };
    activeOrganization: null | {
        id: number;
        name: string;
    };
    membership: null | {
        role: 'owner' | 'admin' | 'member';
        status: 'active' | 'pending';
    };
    pendingRequests: Array<{
        id: number;
        organizationName: string;
        status: 'pending';
        createdAt: string;
    }>;
    stats: null;
    recentActivity: [];
};

export type DashboardState =
    | 'NO_ORGANIZATION'
    | 'PENDING_ORGANIZATION_REQUEST'
    | 'MEMBER_DASHBOARD'
    | 'ADMIN_DASHBOARD';
