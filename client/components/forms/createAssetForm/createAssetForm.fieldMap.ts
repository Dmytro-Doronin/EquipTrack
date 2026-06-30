import { Path } from 'react-hook-form';

import { CreateAssetFormValues } from './createAssetForm.types';

export const createAssetFieldMap = {
    name: 'name',
    category: 'category',

    serialNumber: 'serialNumber',
    serial_number: 'serialNumber',

    status: 'status',

    assignedToUserId: 'assignedToUserId',
    assigned_to_user_id: 'assignedToUserId',

    assignedAt: 'assignedAt',
    assigned_at: 'assignedAt',

    dueDate: 'dueDate',
    due_date: 'dueDate',

    imageUrl: 'imageUrl',
    image_url: 'imageUrl',
} satisfies Partial<Record<string, Path<CreateAssetFormValues>>>;
