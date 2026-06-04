'use client';

import { useQuery } from '@tanstack/react-query';

import { getJoinRequests } from '@/api/organizations/getJoinRequests';
import { getErrorMessage } from '@/utils/ErrorUtil';

export const pendingJoinRequestsQueryKey = (organizationId: number) =>
    ['organizations', organizationId, 'join-requests', 'pending'] as const;

export const usePendingJoinRequestsQuery = (organizationId: number) => {
    const joinRequestsQuery = useQuery({
        queryKey: pendingJoinRequestsQueryKey(organizationId),
        queryFn: () => getJoinRequests({ organizationId, status: 'pending' }),
    });

    return {
        ...joinRequestsQuery,
        errorMessage: joinRequestsQuery.error ? getErrorMessage(joinRequestsQuery.error) : null,
        joinRequests: joinRequestsQuery.data ?? [],
    };
};
