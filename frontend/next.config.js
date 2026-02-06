/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;
