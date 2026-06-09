import type { AssetTableItem } from '@/components/assets/model/types';

export const mockAssets: AssetTableItem[] = [
    {
        assignedAt: '2026-02-12T09:00:00.000Z',
        assignedTo: {
            id: 18,
            login: 'Maya Chen',
        },
        category: 'Laptop',
        createdAt: '2026-01-18T12:30:00.000Z',
        dueDate: '2027-02-12T09:00:00.000Z',
        id: 1001,
        imageUrl:
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=160&q=80',
        name: 'MacBook Pro 14-inch',
        serialNumber: 'MBP14-2026-018',
        status: 'assigned',
    },
    {
        assignedAt: null,
        assignedTo: null,
        category: 'Camera',
        createdAt: '2026-03-04T15:10:00.000Z',
        dueDate: null,
        id: 1002,
        imageUrl:
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=160&q=80',
        name: 'Sony Alpha A7 IV',
        serialNumber: 'CAM-A7IV-4421',
        status: 'available',
    },
    {
        assignedAt: '2026-04-21T08:15:00.000Z',
        assignedTo: {
            id: 24,
            login: 'Jon Bell',
        },
        category: 'Scanner',
        createdAt: '2026-02-27T10:45:00.000Z',
        dueDate: '2026-07-21T08:15:00.000Z',
        id: 1003,
        imageUrl:
            'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=160&q=80',
        name: 'Zebra DS3608 Scanner',
        serialNumber: 'ZDS-3608-9910',
        status: 'maintenance',
    },
    {
        assignedAt: null,
        assignedTo: null,
        category: 'Display',
        createdAt: '2026-05-09T14:20:00.000Z',
        dueDate: null,
        id: 1004,
        name: 'Dell UltraSharp 27 Monitor',
        serialNumber: 'DU27-QHD-7302',
        status: 'available',
    },
    {
        assignedAt: '2026-01-30T13:00:00.000Z',
        assignedTo: {
            id: 31,
            login: 'Ari Novak',
        },
        category: 'Tablet',
        createdAt: '2026-01-22T11:05:00.000Z',
        dueDate: '2026-08-30T13:00:00.000Z',
        id: 1005,
        imageUrl:
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=160&q=80',
        name: 'iPad Air Field Kit',
        serialNumber: 'IPADAIR-FLD-204',
        status: 'lost',
    },
];
