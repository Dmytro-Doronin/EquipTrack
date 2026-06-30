import { CreateAssetForm } from '@/components/forms/createAssetForm/CreateAssetForm';

type CreateAssetProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const CreateAsset = ({ isOpen, onClose }: CreateAssetProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-main">Create asset</h2>
            <CreateAssetForm onCancel={onClose} onSuccess={onClose} />
        </div>
    );
};
