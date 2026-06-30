import type { AssetTableItem } from '@/components/assets/model/types';
import type { CreateAssetFormValues } from '@/components/forms/createAssetForm/createAssetForm.types';
import type { Asset, CreateAssetPayload } from '@/shared/api/types/asset.types';

export const mapAssetToTableItem = (asset: Asset): AssetTableItem => ({
    assignedAt: asset.assignedAt,
    assignedTo: asset.assignedTo,
    category: asset.category,
    createdAt: asset.createdAt,
    dueDate: asset.dueDate,
    id: asset.id,
    imageUrl: asset.imageUrl ?? undefined,
    name: asset.name,
    serialNumber: asset.serialNumber,
    status: asset.status,
});

export const mapCreateAssetFormValuesToPayload = (
    values: CreateAssetFormValues,
): CreateAssetPayload => {
    const assignedToUserId = toOptionalPositiveInteger(values.assignedToUserId);
    const assignedAt = toOptionalIsoString(values.assignedAt);
    const dueDate = toOptionalIsoString(values.dueDate);
    const imageUrl = toOptionalString(values.imageUrl);

    return {
        name: values.name.trim(),
        category: values.category.trim(),
        serialNumber: values.serialNumber.trim(),
        status: values.status,
        ...(assignedToUserId ? { assignedToUserId } : {}),
        ...(assignedAt ? { assignedAt } : {}),
        ...(dueDate ? { dueDate } : {}),
        ...(imageUrl ? { imageUrl } : {}),
    };
};

const toOptionalString = (value?: string) => {
    const trimmedValue = value?.trim();

    return trimmedValue || undefined;
};

const toOptionalPositiveInteger = (value?: string) => {
    const normalizedValue = toOptionalString(value);

    if (!normalizedValue) {
        return undefined;
    }

    const numericValue = Number(normalizedValue);

    if (!Number.isInteger(numericValue) || numericValue < 1) {
        return undefined;
    }

    return numericValue;
};

const toOptionalIsoString = (value?: string) => {
    const normalizedValue = toOptionalString(value);

    if (!normalizedValue) {
        return undefined;
    }

    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    return date.toISOString();
};
