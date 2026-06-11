import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/features',
                permanent: false,
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'equip-tracker.s3.eu-north-1.amazonaws.com',
                pathname: '/avatars/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
};

export default nextConfig;
