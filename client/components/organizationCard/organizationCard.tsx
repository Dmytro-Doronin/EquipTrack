'use client';

import Image from 'next/image';

import { organizationViewType } from '@/app/(private)/onboarding/organizations/join/ui/JoinClientPage';
import { Button } from '@/components/ui/button/Button';
type OrganizationCard = {
    organization: organizationViewType;
};

export const OrganizationCard = ({ organization }: OrganizationCard) => {
    return (
        <div className="flex flex-col px-5 py-4 rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center mb-2">
                <Image
                    src={organization.image ?? '/no-image-available.jpg'}
                    alt="Picture of the author"
                    width={100}
                    height={100}
                    className="rounded-[10px]"
                />
                <div className="flex flex-col">
                    <h3 className="font-bold text-[18px]">{organization.name}</h3>
                    <p className="text-[14px] text-sub-text">{organization.slug}</p>
                </div>
            </div>
            <Button size="compact">Request to join</Button>
        </div>
    );
};
