import type { AssetStatus, AssetTableItem } from '@/components/assets/model/types';

import EquipmentIcon from '@/components/icons/EquipmentIcon';
import { Button } from '@/components/ui/button/Button';
import { formatDisplayDate } from '@/utils/formatDate';
import { formatStatus } from '@/utils/formatUtils';

type AssetTableRowProps = {
    asset: AssetTableItem;
};

const statusBadgeClassNames: Record<AssetStatus, string> = {
    assigned: 'bg-blue-50 text-blue-700 ring-blue-200',
    available: 'bg-success-light text-emerald-700 ring-emerald-200',
    lost: 'bg-red-50 text-red-700 ring-red-200',
    maintenance: 'bg-amber-50 text-amber-700 ring-amber-200',
};

export const AssetTableRow = ({ asset }: AssetTableRowProps) => {
    const assignedDate = formatDisplayDate(asset.assignedAt);
    const createdDate = formatDisplayDate(asset.createdAt);
    const dueDate = formatDisplayDate(asset.dueDate);

    return (
        <tr className="bg-white align-middle transition-colors hover:bg-round/45">
            <td className="px-5 py-4">
                <div className="flex min-w-[260px] items-center gap-3">
                    <AssetThumbnail asset={asset} />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-dark">{asset.name}</p>
                        <p className="mt-1 truncate text-xs text-sub-text">
                            S/N {asset.serialNumber}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-4 text-sm text-sub-text">{asset.category}</td>
            <td className="px-5 py-4">
                <span
                    className={[
                        'inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset',
                        statusBadgeClassNames[asset.status],
                    ].join(' ')}
                >
                    {formatStatus(asset.status)}
                </span>
            </td>
            <td className="px-5 py-4 text-sm text-sub-text">
                {asset.assignedTo?.login ?? 'Unassigned'}
            </td>
            <td className="px-5 py-4 text-sm text-sub-text">{assignedDate ?? '-'}</td>
            <td className="px-5 py-4 text-sm text-sub-text">{dueDate ?? '-'}</td>
            <td className="px-5 py-4 text-sm text-sub-text">{createdDate ?? '-'}</td>
            <td className="px-5 py-4 text-right">
                <Button
                    aria-label={`Open actions for ${asset.name}`}
                    className="size-9 rounded-full text-sub-text hover:bg-gray-100 hover:text-dark"
                    size="transparent"
                    type="button"
                    variant="transparent"
                >
                    <MoreHorizontalIcon />
                </Button>
            </td>
        </tr>
    );
};

type AssetThumbnailProps = {
    asset: AssetTableItem;
};

const AssetThumbnail = ({ asset }: AssetThumbnailProps) => {
    if (asset.imageUrl) {
        return (
            <img
                alt={`${asset.name} asset thumbnail`}
                className="size-10 shrink-0 rounded-lg border border-gray-main object-cover"
                loading="lazy"
                src={asset.imageUrl}
            />
        );
    }

    return (
        <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-gray-main bg-round text-main">
            <EquipmentIcon className="size-5" />
        </div>
    );
};

const MoreHorizontalIcon = () => (
    <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="5" cy="10" r="1.5" />
        <circle cx="10" cy="10" r="1.5" />
        <circle cx="15" cy="10" r="1.5" />
    </svg>
);
