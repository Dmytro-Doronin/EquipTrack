import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardContextQueryKey } from '@/hooks/query/useDashboardContext';
import { pendingJoinRequestsQueryKey } from '@/hooks/query/usePendingJoinRequestsQuery';
import { rejectJoinRequest } from '@/shared/api/organizations/rejectJoinRequest';
import { ModerateJoinRequestPayload } from '@/shared/api/types/organization.types';

export function useRejectJoinRequestMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectJoinRequest,
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
