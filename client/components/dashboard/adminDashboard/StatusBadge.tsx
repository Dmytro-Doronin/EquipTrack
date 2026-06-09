import { formatStatus } from '@/utils/formatUtils';

type StatusBadgeProps = {
    className?: string;
    status: string;
};

export const StatusBadge = ({ className = '', status }: StatusBadgeProps) => {
    return (
        <span
            className={`inline-flex w-fit rounded-full bg-round px-3 py-1 text-xs font-medium capitalize text-main ${className}`}
        >
            {formatStatus(status)}
        </span>
    );
};
