import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rejectJoinRequest } from '@/api/organizations/rejectJoinRequest';
import { ModerateJoinRequestPayload } from '@/api/types/organization.types';
import { pendingJoinRequestsQueryKey } from '@/hooks/query/usePendingJoinRequestsQuery';

export function useRejectJoinRequestMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectJoinRequest,
        onSuccess: (_data, variables: ModerateJoinRequestPayload) =>
            queryClient.invalidateQueries({
                queryKey: pendingJoinRequestsQueryKey(variables.organizationId),
            }),
    });
}
