import { useMutation } from '@tanstack/react-query';

import { logoutApi } from '@/api/auth/auth';
import { useAuthStore } from '@/stores/auth.store';

export function useLogoutMutation() {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            console.log('logout success');
            clearAuth();
        },
        onError: (error) => {
            console.log(error);
        },
    });
}
