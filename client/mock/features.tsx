import InventoryIcon from '@/components/icons/InventoryIcon';
import PinIcon from '@/components/icons/PinIcon';
import TeamIcon from '@/components/icons/TeamIcon';

export const features = [
    {
        description:
            'Monitor your high-value assets across multiple locations with millimeter precision and instant status updates.',
        icon: <PinIcon />,
        title: 'Real-time equipment tracking',
    },
    {
        description:
            'Assign roles, manage permissions, and track check-ins/check-outs with a unified team dashboard.',
        icon: <TeamIcon />,
        title: 'Easy team management',
    },
    {
        description:
            'Automated stock alerts and comprehensive reporting help you maintain perfect inventory levels at all times.',
        icon: <InventoryIcon />,
        title: 'Smart inventory overview',
    },
];
