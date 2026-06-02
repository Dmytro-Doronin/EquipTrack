import Link from 'next/link';

import { Button } from '@/components/ui/button/Button';

export function NoOrganizationDashboard() {
    return (
        <section className="flex min-h-[420px] items-center justify-center rounded-[12px] border border-dashed border-gray-main bg-round/60 px-4 py-12">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                <p className="mb-3 text-sm font-medium text-sub-text">Getting started</p>
                <h2 className="max-w-lg text-2xl font-bold text-dark">
                    You are not part of any organization yet
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-sub-text">
                    Create or join an organization to start tracking assets with your team.
                </p>
                <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
                    <Button as={Link} href="/organizations/create">
                        Create organization
                    </Button>
                    <Button
                        as={Link}
                        href="/organizations/join"
                        variant="transparent"
                        size="transparent"
                        className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-gray-main bg-white px-8 py-3.5 text-sm font-medium text-main transition hover:bg-round focus-visible:ring-1 focus-visible:ring-main focus-visible:ring-offset-1"
                    >
                        Join organization
                    </Button>
                </div>
            </div>
        </section>
    );
}
