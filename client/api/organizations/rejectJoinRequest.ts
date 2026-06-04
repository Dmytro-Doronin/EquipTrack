import { apiClient } from '@/api/apiClient';
import {
    ModerateJoinRequestPayload,
    RejectJoinRequestResponse,
    RejectJoinRequestResult,
} from '@/api/types/organization.types';

export const rejectJoinRequest = async ({
    organizationId,
    requestId,
}: ModerateJoinRequestPayload): Promise<RejectJoinRequestResult> => {
    const response = await apiClient.post<RejectJoinRequestResponse>(
        `/organizations/${organizationId}/join-requests/${requestId}/reject`,
    );

    return response.data.data;
};
