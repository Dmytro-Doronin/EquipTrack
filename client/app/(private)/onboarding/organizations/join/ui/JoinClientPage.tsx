'use client';

import Search from '@/components/icons/Search';
import { OrganizationList } from '@/components/organizationsList/OrganizationList';
import { Button } from '@/components/ui/button/Button';
import { TextField } from '@/components/ui/textField/TextField';

export type organizationViewType = {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    description: string;
};

const organizations: organizationViewType[] = [
    { id: '1', name: 'IKEA', slug: 'ikea/shop', image: null, description: 'Shop of the shop' },
    {
        id: '2',
        name: 'Booking.com',
        slug: 'Booking/service',
        image: null,
        description: 'Service of the service',
    },
    { id: '3', name: 'Adyen', slug: 'adyen/finance', image: null, description: 'Finance Service' },
];

export const JoinClientPage = () => {
    return (
        <div className="max-w-2xl w-full bg-white rounded-lg p-5 mt-7.5">
            <div className="grid grid-cols-[400px_auto] gap-2 mb-5">
                <TextField
                    Icon={Search}
                    containerClassName="flex"
                    placeholder="Ex: organization name or slug"
                />
                <Button>Search</Button>
            </div>
            <OrganizationList organizations={organizations} />
        </div>
    );
};
