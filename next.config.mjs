/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'i.scdn.co',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'mosaic.scdn.co',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'wrapped-images.spotifycdn.com',
                pathname: '/**',
            },
        ],
    },
    allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;