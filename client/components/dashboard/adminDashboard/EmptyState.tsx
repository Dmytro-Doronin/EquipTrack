type EmptyStateProps = {
    children: string;
    className?: string;
};

export const EmptyState = ({ children, className = '' }: EmptyStateProps) => {
    return (
        <div
            className={`rounded-lg border border-gray-main bg-round px-4 py-5 text-center text-sm text-sub-text ${className}`}
        >
            {children}
        </div>
    );
};
