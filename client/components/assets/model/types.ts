import type { AssetAssignedUser, AssetStatus } from '@/shared/api/types/asset.types';

export type { AssetStatus };

export type AssetAssignee = AssetAssignedUser;

export type AssetTableItem = {
    assignedAt?: string | null;
    assignedTo?: AssetAssignee | null;
    category: string;
    createdAt: string;
    dueDate?: string | null;
    id: number;
    imageUrl?: string;
    name: string;
    serialNumber: string;
    status: AssetStatus;
};
