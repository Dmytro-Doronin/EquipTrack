'use client';

import { OrganizationSearchResult } from '@/api/types/organization.types';
import { Button } from '@/components/ui/button/Button';

type OrganizationCardProps = {
    disabled?: boolean;
    isSubmitting?: boolean;
    organization: OrganizationSearchResult;
    onRequestJoin: (organization: OrganizationSearchResult) => void;
};

export const OrganizationCard = ({
    disabled = false,
    isSubmitting = false,
    organization,
    onRequestJoin,
}: OrganizationCardProps) => {
    const initial = organization.name.trim().charAt(0).toUpperCase() || '?';

    return (
        <div className="flex min-h-36 flex-col justify-between rounded-lg border border-gray-main bg-white px-5 py-4">
            <div className="mb-4 flex items-center gap-3">
                <div
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-lg bg-round text-lg font-bold text-main"
                >
                    {initial}
                </div>
                <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-bold text-dark">
                        {organization.name}
                    </h3>
                </div>
            </div>
            <Button
                className="disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                onClick={() => onRequestJoin(organization)}
                size="compact"
                type="button"
            >
                {isSubmitting ? 'Sending...' : 'Request to join'}
            </Button>
        </div>
    );
};
