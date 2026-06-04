import { useMutation, useQueryClient } from '@tanstack/react-query';

import { approveJoinRequest } from '@/api/organizations/approveJoinRequest';
import { ModerateJoinRequestPayload } from '@/api/types/organization.types';
import { pendingJoinRequestsQueryKey } from '@/hooks/query/usePendingJoinRequestsQuery';

export function useApproveJoinRequestMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveJoinRequest,
        onSuccess: (_data, variables: ModerateJoinRequestPayload) =>
            queryClient.invalidateQueries({
                queryKey: pendingJoinRequestsQueryKey(variables.organizationId),
            }),
    });
}
