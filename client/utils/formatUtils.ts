export const formatRole = (role?: string | null): string | null => {
    if (!role) {
        return null;
    }

    return role.charAt(0).toUpperCase() + role.slice(1);
};

export const formatStatus = (status: string): string => status.replaceAll('_', ' ');
