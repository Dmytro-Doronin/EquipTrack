import { apiClient } from '@/api/apiClient';
import {
    OrganizationSearchResult,
    SearchOrganizationsResponse,
} from '@/api/types/organization.types';

export const searchOrganizations = async (query: string): Promise<OrganizationSearchResult[]> => {
    const response = await apiClient.get<SearchOrganizationsResponse>('/organizations/search', {
        params: {
            query,
        },
    });

    return response.data.data;
};
