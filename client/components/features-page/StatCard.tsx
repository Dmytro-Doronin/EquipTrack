type StatCardProps = {
    label: string;
    value: string;
};

export const StatCard = ({ label, value }: StatCardProps) => {
    return (
        <article className="flex min-h-[210px] items-center justify-center rounded-[8px] border border-gray-main bg-white p-6 text-center">
            <div>
                <p className="text-[44px] leading-none font-extrabold text-main">{value}</p>
                <p className="mt-4 text-[15px] text-main">{label}</p>
            </div>
        </article>
    );
};
