import { apiClient } from '@/api/apiClient';
import { GetMeResponse } from '@/api/types/auth.types';

export const getMe = async () => {
    const response = await apiClient.get<GetMeResponse>('/auth/me');
    return response.data.data;
};
