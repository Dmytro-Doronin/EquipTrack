import type { AssetAssignee, AssetStatus } from '@/components/assets/model/types';

export type Asset = {
    assignedAt?: string | null;
    assignedTo?: AssetAssignee | null;
    assignedToUserId?: number | null;
    category: string;
    createdAt: string;
    dueDate?: string | null;
    id: number;
    imageUrl?: string | null;
    name: string;
    organizationId?: number;
    serialNumber: string;
    status: AssetStatus;
};

export type GetAssetsResponse = {
    success: boolean;
    data: Asset[];
};
