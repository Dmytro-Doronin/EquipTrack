'use client';

import { useCallback } from 'react';

import type { Permission } from '@/types/dashboard/types';

import { useDashboardContext } from '@/hooks/query/useDashboardContext';

export const useDashboardAccess = () => {
    const query = useDashboardContext();
    const dashboard = query.data ?? null;
    const role = dashboard?.membership?.role ?? null;
    const permissions = dashboard?.permissions ?? [];
    const can = useCallback(
        (permission: Permission) => permissions.includes(permission),
        [permissions],
    );

    return {
        ...query,
        dashboard,
        role,
        permissions,
        can,
        canCreateAsset: can('asset:create'),
        canUpdateAsset: can('asset:update'),
        canDeleteAsset: can('asset:delete'),
        canReadAsset: can('asset:read'),
        canCreateTransfer: can('transfer:create'),
        canInviteMember: can('member:invite'),
        canRemoveMember: can('member:remove'),
        canUpdateOrganization: can('organization:update'),
        isOwner: role === 'owner',
        isAdmin: role === 'admin',
        isMember: role === 'member',
    };
};
