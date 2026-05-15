import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'equip-tracker.s3.eu-north-1.amazonaws.com',
                pathname: '/avatars/**',
            },
        ],
    },
};

export default nextConfig;
