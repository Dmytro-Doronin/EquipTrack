import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pendingJoinRequestsQueryKey } from '@/hooks/query/usePendingJoinRequestsQuery';
import { rejectJoinRequest } from '@/shared/api/organizations/rejectJoinRequest';
import { ModerateJoinRequestPayload } from '@/shared/api/types/organization.types';

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
