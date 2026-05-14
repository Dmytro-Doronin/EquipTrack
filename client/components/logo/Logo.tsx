import Link from 'next/link';

import { Button } from '@/components/ui/button/Button';

export const Logo = () => {
    return (
        <Button as={Link} href="/features" variant="link">
            <div className="flex items-center justify-center text-[18px] bg-dark text-white w-8 h-8 rounded-sm">
                ET
            </div>
        </Button>
    );
};
