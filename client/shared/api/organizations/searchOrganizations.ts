import { apiClient } from '@/shared/api/apiClient';
import {
    OrganizationSearchResult,
    SearchOrganizationsResponse,
} from '@/shared/api/types/organization.types';

export const searchOrganizations = async (query: string): Promise<OrganizationSearchResult[]> => {
    const response = await apiClient.get<SearchOrganizationsResponse>('/organizations/search', {
        params: {
            query,
        },
    });

    return response.data.data;
};
