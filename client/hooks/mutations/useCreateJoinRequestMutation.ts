import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createJoinRequest } from '@/shared/api/organizations/createJoinRequest';

export function useCreateJoinRequestMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createJoinRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard-context'] }),
    });
}
