import { apiClient } from '@/shared/api/apiClient';
import { GetMeResponse } from '@/shared/api/types/auth.types';

export const getMe = async () => {
    const response = await apiClient.get<GetMeResponse>('/auth/me');
    return response.data.data;
};

export const logoutApi = async () => {
    return await apiClient.post('/auth/logout');
};
