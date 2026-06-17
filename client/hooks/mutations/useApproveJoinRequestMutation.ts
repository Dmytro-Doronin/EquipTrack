import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardContextQueryKey } from '@/hooks/query/useDashboardContext';
import { pendingJoinRequestsQueryKey } from '@/hooks/query/usePendingJoinRequestsQuery';
import { approveJoinRequest } from '@/shared/api/organizations/approveJoinRequest';
import { ModerateJoinRequestPayload } from '@/shared/api/types/organization.types';

export function useApproveJoinRequestMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveJoinRequest,
        onSuccess: async (_data, variables: ModerateJoinRequestPayload) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: pendingJoinRequestsQueryKey(variables.organizationId),
                }),
                queryClient.invalidateQueries({ queryKey: dashboardContextQueryKey }),
            ]);
        },
    });
}
