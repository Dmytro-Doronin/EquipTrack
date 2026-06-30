export const assetStatusValues = ['available', 'assigned', 'maintenance', 'lost'] as const;

export type AssetStatus = (typeof assetStatusValues)[number];

export type AssetAssignedUser = {
    id: number;
    login: string;
};

export type Asset = {
    assignedAt: string | null;
    assignedTo: AssetAssignedUser | null;
    assignedToUserId: number | null;
    category: string;
    createdAt: string;
    dueDate: string | null;
    id: number;
    imageUrl: string | null;
    name: string;
    organizationId: number;
    serialNumber: string;
    status: AssetStatus;
};

export type CreateAssetPayload = {
    name: string;
    category: string;
    serialNumber: string;
    status: AssetStatus;
    assignedToUserId?: number | null;
    assignedAt?: string | null;
    dueDate?: string | null;
    imageUrl?: string | null;
};

export type GetAssetsResponse = {
    success: boolean;
    data: Asset[];
};

export type CreateAssetResponse = {
    success: boolean;
    message: string;
    data: Asset;
};
