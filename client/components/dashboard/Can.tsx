'use client';

import type { ReactNode } from 'react';

import type { Permission } from '@/types/dashboard/types';

import { useDashboardAccess } from '@/hooks/custom/useDashboardAccess';

type CanProps = {
    children: ReactNode;
    fallback?: ReactNode;
    permission: Permission;
};

export const Can = ({ children, fallback = null, permission }: CanProps) => {
    const { can, dashboard, isLoading } = useDashboardAccess();

    if (!dashboard && isLoading) {
        return null;
    }

    if (!can(permission)) {
        return fallback;
    }

    return <>{children}</>;
};
