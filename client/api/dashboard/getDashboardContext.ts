import { apiClient } from '@/api/apiClient';
import { DashboardContext } from '@/types/dashboard/types';

type DashboardContextResponse =
    | DashboardContext
    | {
          success: boolean;
          data: DashboardContext;
      };

export const getDashboardContext = async (): Promise<DashboardContext> => {
    const response = await apiClient.get<DashboardContextResponse>('/dashboard');
    const payload = response.data;

    if ('data' in payload) {
        return payload.data;
    }

    return payload;
};
