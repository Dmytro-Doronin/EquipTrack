import { apiClient } from '@/api/apiClient';
import { AuthUser } from '@/stores/auth.store';

export async function getMe() {
    const response = await apiClient.get<AuthUser>('/auth/me');
    return response.data;
}
