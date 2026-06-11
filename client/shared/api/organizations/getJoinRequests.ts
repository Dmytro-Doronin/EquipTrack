import { apiClient } from '@/shared/api/apiClient';
import {
    GetJoinRequestsResponse,
    OrganizationJoinRequest,
} from '@/shared/api/types/organization.types';

type GetJoinRequestsParams = {
    organizationId: number;
    status?: 'pending';
};

export const getJoinRequests = async ({
    organizationId,
    status = 'pending',
}: GetJoinRequestsParams): Promise<OrganizationJoinRequest[]> => {
    const response = await apiClient.get<GetJoinRequestsResponse>(
        `/organizations/${organizationId}/join-requests`,
        {
            params: {
                status,
            },
        },
    );

    return response.data.data;
};
