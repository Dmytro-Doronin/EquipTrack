import { apiClient } from '@/shared/api/apiClient';
import {
    ApproveJoinRequestResponse,
    ApproveJoinRequestResult,
    ModerateJoinRequestPayload,
} from '@/shared/api/types/organization.types';

export const approveJoinRequest = async ({
    organizationId,
    requestId,
}: ModerateJoinRequestPayload): Promise<ApproveJoinRequestResult> => {
    const response = await apiClient.post<ApproveJoinRequestResponse>(
        `/organizations/${organizationId}/join-requests/${requestId}/approve`,
    );

    return response.data.data;
};
