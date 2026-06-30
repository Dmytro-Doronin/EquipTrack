import { Loader } from '@/components/loader/Loader';
import { Button } from '@/components/ui/button/Button';
import { useLogoutMutation } from '@/hooks/mutations/useLogoutMutation';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const LogoutConfirmation = ({ isOpen, onClose }: Props) => {
    const { mutateAsync: logout, isPending } = useLogoutMutation();

    const onLogoutHandler = async () => {
        logout().then(() => onClose());
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-main mb-4">Confirm Logout</h2>

            <div className="mb-6 text-gray-700">
                <p>Are you sure you want to log out?</p>
            </div>

            <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={onLogoutHandler} disabled={isPending}>
                    {isPending ? 'Logging out...' : 'Log out'}
                </Button>
            </div>
            {isPending && <Loader />}
        </div>
    );
};
