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
        organizationId: number;
        organizationName: string;
        status: 'pending';
        createdAt: string;
    }>;
    stats: DashboardStats;
    myAssets: DashboardMemberAsset[];
    myTransfers: DashboardMemberTransfer[];
    recentActivity: DashboardRecentActivity[];
};

export type DashboardStats = {
    assignedAssets: number;
    pendingTransfers: number;
    overdueReturns: number;
};

export type DashboardMemberAsset = {
    id: number;
    name: string;
    category: string;
    serialNumber: string;
    status: string;
    assignedAt: string;
    dueDate?: string | null;
};

export type DashboardTransferUser = {
    id: number;
    login: string;
};

export type DashboardMemberTransfer = {
    id: number;
    assetId: number;
    assetName: string;
    fromUser?: DashboardTransferUser | null;
    toUser?: DashboardTransferUser | null;
    status: string;
    createdAt: string;
};

export type DashboardRecentActivity = {
    id: number;
    type: string;
    message: string;
    createdAt: string;
};

export type DashboardState =
    | 'NO_ORGANIZATION'
    | 'PENDING_ORGANIZATION_REQUEST'
    | 'MEMBER_DASHBOARD'
    | 'ADMIN_DASHBOARD';
