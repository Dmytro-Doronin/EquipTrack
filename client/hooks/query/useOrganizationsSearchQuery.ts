'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { searchOrganizations } from '@/api/organizations/searchOrganizations';
import { useNotificationStore } from '@/stores/notification.store';
import { getErrorMessage } from '@/utils/ErrorUtil';

type UseOrganizationsSearchQueryOptions = {
    enabled?: boolean;
    showGlobalError?: boolean;
};

export const organizationsSearchQueryKey = (query: string) =>
    ['organizations', 'search', query] as const;

export const useOrganizationsSearchQuery = (
    query: string,
    options: UseOrganizationsSearchQueryOptions = {},
) => {
    const { enabled = true, showGlobalError = false } = options;

    const notifyError = useNotificationStore((state) => state.error);

    const organizationsQuery = useQuery({
        queryKey: organizationsSearchQueryKey(query),
        queryFn: () => searchOrganizations(query),
        enabled: enabled && query.length > 0,
    });

    useEffect(() => {
        if (!showGlobalError || !organizationsQuery.error) {
            return;
        }

        notifyError(getErrorMessage(organizationsQuery.error));
    }, [organizationsQuery.errorUpdatedAt, organizationsQuery.error, showGlobalError, notifyError]);

    return {
        ...organizationsQuery,
        organizations: organizationsQuery.data ?? [],
        errorMessage: organizationsQuery.error ? getErrorMessage(organizationsQuery.error) : null,
    };
};
