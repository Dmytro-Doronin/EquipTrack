import type { CreateAssetFormValues } from '@/components/forms/createAssetForm/createAssetForm.types';

export const statusOptions: Array<{
    label: string;
    value: CreateAssetFormValues['status'];
}> = [
    { label: 'Available', value: 'available' },
    { label: 'Assigned', value: 'assigned' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Lost', value: 'lost' },
];
