import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOrganization } from '@/api/organizations/createOrganization';

export function useCreateOrganizationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOrganization,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard-context'] }),
    });
}
