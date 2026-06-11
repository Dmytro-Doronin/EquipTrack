import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logoutApi } from '@/shared/api/auth/auth';
import { useAuthStore } from '@/stores/auth.store';
import { clearAuthHint } from '@/utils/authHint';

export function useLogoutMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    return useMutation({
        mutationFn: logoutApi,
        onSettled: () => {
            clearAuth();
            clearAuthHint();
            queryClient.clear();
            router.replace('/signin');
        },
    });
}
