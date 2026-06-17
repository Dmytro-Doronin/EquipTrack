import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardContextQueryKey } from '@/hooks/query/useDashboardContext';
import { createOrganization } from '@/shared/api/organizations/createOrganization';

export function useCreateOrganizationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOrganization,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: dashboardContextQueryKey }),
    });
}
