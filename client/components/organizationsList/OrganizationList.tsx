'use client';

import { OrganizationSearchResult } from '@/api/types/organization.types';
import { OrganizationCard } from '@/components/organizationCard/organizationCard';

type OrganizationListType = {
    disabled?: boolean;
    organizations: OrganizationSearchResult[];
    requestingOrganizationId?: number | null;
    onRequestJoin: (organization: OrganizationSearchResult) => void;
};

export const OrganizationList = ({
    disabled = false,
    organizations,
    requestingOrganizationId = null,
    onRequestJoin,
}: OrganizationListType) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {organizations.map((organization) => (
                <OrganizationCard
                    disabled={disabled}
                    isSubmitting={requestingOrganizationId === organization.id}
                    key={organization.id}
                    organization={organization}
                    onRequestJoin={onRequestJoin}
                />
            ))}
        </div>
    );
};
