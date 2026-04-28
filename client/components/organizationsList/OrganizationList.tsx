'use client';

import { organizationViewType } from '@/app/(private)/onboarding/organizations/join/ui/JoinClientPage';
import { OrganizationCard } from '@/components/organizationCard/organizationCard';

type OrganizationListType = {
    organizations: organizationViewType[];
};

export const OrganizationList = ({ organizations }: OrganizationListType) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {organizations.map((organization) => (
                <OrganizationCard key={organization.id} organization={organization} />
            ))}
        </div>
    );
};
