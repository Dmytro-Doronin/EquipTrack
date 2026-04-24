import Create from '@/components/icons/Create';
import Join from '@/components/icons/Join';

export const OrganizationsClientPage = () => {
    return (
        <div className="max-w-2xl w-full bg-white rounded-[8px] p-[20px] mt-[30px]">
            <h1 className="font-bold text-[24px] text-center mb-8">
                Create or join an organization
            </h1>
            <div className="flex flex-col gap-[16px]">
                <div className="p-6.5 rounded-[8px] border-[2px] border-gray-main">
                    <div className="flex gap-[16px]">
                        <div className="w-[48px] h-[48px] bg-round rounded-full flex items-center justify-center">
                            <Create />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="font-bold text-[18px] text-main">Create</h2>
                            <p className="text-[14px] text-sub-text">Create new organization</p>
                        </div>
                    </div>
                </div>
                <div className="p-6.5 rounded-[8px] border-[2px] border-gray-main">
                    <div className="flex gap-[16px]">
                        <div className="w-[48px] h-[48px] bg-round rounded-full flex items-center justify-center">
                            <Join />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="font-bold text-[18px] text-main">Join</h2>
                            <p className="text-[14px] text-sub-text">Join existing organization</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
