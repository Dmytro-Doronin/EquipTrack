import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pendingJoinRequestsQueryKey } from '@/hooks/query/usePendingJoinRequestsQuery';
import { approveJoinRequest } from '@/shared/api/organizations/approveJoinRequest';
import { ModerateJoinRequestPayload } from '@/shared/api/types/organization.types';

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
