import { apiClient } from '@/api/apiClient';
import { CreateJoinRequestResponse, CreateJoinRequestResult } from '@/api/types/organization.types';

export const createJoinRequest = async (
    organizationId: number,
): Promise<CreateJoinRequestResult> => {
    const response = await apiClient.post<CreateJoinRequestResponse>(
        `/organizations/${organizationId}/join-requests`,
    );

    return response.data.data;
};
