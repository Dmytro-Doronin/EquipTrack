import { apiClient } from '@/shared/api/apiClient';
import {
    CreateOrganizationPayload,
    CreateOrganizationResponse,
    CreateOrganizationResult,
} from '@/shared/api/types/organization.types';

export const createOrganization = async (
    payload: CreateOrganizationPayload,
): Promise<CreateOrganizationResult> => {
    const response = await apiClient.post<CreateOrganizationResponse>('/organizations', payload);

    return response.data.data;
};
